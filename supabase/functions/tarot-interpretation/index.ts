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
        status: 401,
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
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Rate Limiting Check (Start of UTC day today)
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
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Extract request body params
    const { cards, context, question, language = 'zh-TW' } = await req.json();

    if (!cards || cards.length === 0) {
      return new Response(
        JSON.stringify({
          error: '請先在內容中添加塔羅牌標籤（例如：#fool, #magician）',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 4. Call Google Gemini API
    const GEMINI_API_KEY =
      Deno.env.get('VITE_GOOGLE_AI_KEY') || Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      console.error('Missing VITE_GOOGLE_AI_KEY or GEMINI_API_KEY secret.');
      return new Response(
        JSON.stringify({ error: 'AI 服務金鑰未在後端設定，請聯繫管理員。' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const promptText = `
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

    console.log('Calling Gemini API securely for user:', user.id);

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptText,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API returned error:', geminiResponse.status, errorText);
      throw new Error('Gemini AI 服務呼叫失敗');
    }

    const geminiData = await geminiResponse.json();
    const interpretation = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!interpretation) {
      throw new Error('AI 回傳結果格式不正確或為空');
    }

    // 5. Success! Log usage inside database
    const { error: logError } = await supabaseClient
      .from('ai_usage_logs')
      .insert({ user_id: user.id });

    if (logError) {
      console.error('Failed to log AI usage:', logError);
      // We don't block the response even if logging fails, but we print a log
    }

    console.log('AI interpretation generated and logged successfully');

    return new Response(JSON.stringify({ interpretation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in tarot-interpretation function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : '未知伺服器錯誤',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
