import 'https://deno.land/x/xhr@0.1.0/mod.ts';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: '未提供授權金鑰' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    // Create Supabase client with user's JWT token
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // 1. Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: '登入認證失敗，請重新登入' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Extract request parameters
    const body = await req.json();
    const { action = 'interpret', language = 'zh-TW' } = body;

    // 3. Load Gemini API Key from secure environments
    const GEMINI_API_KEY =
      Deno.env.get('VITE_GOOGLE_AI_KEY') || Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      console.error('Missing VITE_GOOGLE_AI_KEY or GEMINI_API_KEY secret.');
      return new Response(
        JSON.stringify({ error: 'AI 服務金鑰未在後端設定，請聯繫管理員。' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let promptText = '';
    let requestBody: any = {};

    // 4. Handle different actions
    if (action === 'interpret') {
      // Check daily rate limit for interpretation (max 3 times per UTC day)
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);

      const { count, error: countError } = await supabaseClient
        .from('ai_usage_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('used_at', todayStart.toISOString());

      if (countError) {
        console.error('Count query error:', countError);
        throw new Error('無法查詢 AI 額度記錄');
      }

      if (count !== null && count >= 3) {
        return new Response(
          JSON.stringify({
            error: '您今天已達到 3 次 AI 解牌上限，請明天再試。',
            limitExceeded: true,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const { cards, context, question } = body;
      if (!cards || cards.length === 0) {
        return new Response(
          JSON.stringify({
            error: '請先在內容中添加塔羅牌標籤（例如：#fool, #magician）',
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      promptText = `
      Role Definition
      You are an expert Tarot Reader with a deep understanding of Rider-Waite symbolism, Jungian psychology, and constructive counseling. Your tone is empathetic, insightful, and empowering—never fatalistic.
      
      Input Format
      1. Question: ${question || 'General Reading'}
      2. Context: ${context || 'General'}
      3. Spread:
      ${cards.map((card: string, index: number) => `   - Position ${index + 1}: ${card}`).join('\n')}
      4. Language: ${language}
      
      Output Instructions
      Please analyze the spread and provide a response in the following **Markdown** structure.
      **IMPORTANT:** The response MUST be in the same language as the Language specified in the input. If zh-TW is specified, use Traditional Chinese. If en is specified, use English.
      
      Keep the total length concise (under 100 words) but impactful.
      
      ### 1. 🔮 ${language === 'zh-TW' ? '整體能量' : 'The Core Vibe'}
      A 1-2 sentence summary of the spread's main theme.
      
      ### 2. 🃏 ${language === 'zh-TW' ? '牌陣解析' : 'Detailed Interpretation'}
      Analyze the cards in relation to each other and the question.
      - **[Card Name]**: How it answers the specific aspect of the position.
      - Highlight connections: Mention if cards reinforce or contradict each other.
      
      ### 3. 💡 ${language === 'zh-TW' ? '靈感與建議' : 'Guidance & Action'}
      Constructive advice based on the reading.
      - **${language === 'zh-TW' ? '關鍵課題' : 'Key Lesson'}**: What is the user learning?
      - **${language === 'zh-TW' ? '行動建議' : 'Actionable Step'}**: A concrete step the user can take.
      `;

      requestBody = {
        contents: [{ parts: [{ text: promptText }] }],
      };
    } else if (action === 'guidance') {
      promptText = `
      Role: Daily Life Advisor
      Task: Generate a single "今日宜" (Today's Recommendation) style sentence.
      
      Constraints:
      1. Language: ${language} (MUST be ${language === 'zh-TW' ? 'Traditional Chinese' : 'English'}).
      2. Format: 
         - For zh-TW: MUST start with "今日宜:" followed by a short, actionable suggestion
         - For en: Use "Today, try:" or "Today's suggestion:" format
      3. Length: Keep the suggestion part short and sweet (5-10 words after the prefix).
      4. Tone: Warm, gentle, practical, and relatable.
      5. Content Categories:
         - Self-care (rest, eat well, take breaks)
         - Emotional wellness (be patient with yourself, let go, accept)
         - Small actions (do one small thing, reach out to someone, try something new)
         - Mindfulness (slow down, notice small joys, be present)
         - Permission to rest (it's okay to do nothing, take it easy)
      6. Style: Simple, direct, human. Avoid being preachy or overly philosophical.
      
      Example Output (zh-TW):
      "今日宜:好好睡個午覺"
      "今日宜:喝一杯熱茶,慢慢來"
      "今日宜:對自己說「辛苦了」"
      "今日宜:做一件拖很久的小事"
      "今日宜:什麼都不做也沒關係"
      "今日宜:傳訊息給想念的人"
      "今日宜:允許自己不完美"
      
      Example Output (en):
      "Today, try: taking a proper lunch break"
      "Today's suggestion: say something kind to yourself"
      "Today, try: doing one thing you've been putting off"
      "Today's suggestion: it's okay to rest"
      "Today, try: texting someone you miss"
      
      Generate ONE suggestion only.
      `;

      requestBody = {
        contents: [{ parts: [{ text: promptText }] }],
      };
    } else if (action === 'chat') {
      const { messages = [], cards = [], context = '', config = {} } = body;
      const personality = config.personality || 'psychological';

      const systemInstruction = `
      Role: The Oracle — A Wise, Constructive Tarot Mentor.
      Context: The user drew these cards: ${cards.join(', ')}. The general focus of the reading was: ${context}.
      
      Guidelines:
      1. Directness: Avoid overly vague "mystic" or "astrological" fluff unless it directly explains a card's symbol.
      2. Substance: Your primary goal is to help the user gain clarity. Use the specific cards drawn to answer the user's question.
      3. Personality Adjustments:
         - Psychological (Default): Focus on internal state, motivations, and mental frameworks. 
         - Practical: Focus on choices, actions, and real-world consequences.
         - Mystic: Focus on symbolic depth and spiritual transformation (keep this concise and meaningful).
      4. Behavior: If the user asks for advice (e.g., "should I take this job?"), do not tell them what to do. Instead, use the cards to show them the different energies or potential outcomes they should consider.
      5. Language: ${language} (Traditional Chinese/English as requested).
      6. Structure: Use Markdown. Use bold for card names.
      7. Keep the total length concise (under 100 words) but impactful.
      `;

      // Map message history to Gemini history API structure
      let history = messages.slice(0, -1).map((msg: any) => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      if (history.length > 0 && history[0].role === 'model') {
        history = [
          {
            role: 'user',
            parts: [{ text: `I have drawn these cards: ${cards.join(', ')}. Context: ${context}. Please interpret them.` }]
          },
          ...history
        ];
      }

      const lastMessage = messages[messages.length - 1]?.content || '';
      const contents = [
        ...history,
        {
          role: 'user',
          parts: [{ text: `System Context: ${systemInstruction}\n\nUser Question: ${lastMessage}` }]
        }
      ];

      requestBody = {
        contents,
        generationConfig: {
          maxOutputTokens: 2000,
        }
      };
    } else {
      return new Response(JSON.stringify({ error: '不支援的 Action' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Calling Gemini API securely for action: ${action}, user: ${user.id}`);

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API returned error:', geminiResponse.status, errorText);
      
      // Specially intercept and format Gemini 429 quota exceed errors
      if (geminiResponse.status === 429) {
        return new Response(
          JSON.stringify({
            error: 'Google AI 服務今日免費額度已達上限（429 Rate Limit）。請稍後再試，或者明天額度重置時再次嘗試！',
            code: 'GEMINI_QUOTA_EXCEEDED'
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      throw new Error('Gemini AI 服務呼叫失敗');
    }

    const geminiData = await geminiResponse.json();
    const resultText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error('AI 回傳結果格式不正確或為空');
    }

    // 5. If successful and action is interpret, log usage in DB
    if (action === 'interpret') {
      const { error: logError } = await supabaseClient
        .from('ai_usage_logs')
        .insert({ user_id: user.id });

      if (logError) {
        console.error('Failed to log AI usage:', logError);
      }
    }

    console.log(`Secure AI response generated successfully for action: ${action}`);

    return new Response(JSON.stringify({ result: resultText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in tarot-interpretation function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : '未知伺服器錯誤',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
