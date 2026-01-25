import 'https://deno.land/x/xhr@0.1.0/mod.ts';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { load } from 'https://deno.land/std@0.204.0/dotenv/mod.ts';

// Load environment variables once at the start
const env = await load();
const LOVABLE_API = env['LOVABLE_API'];
const LOVABLE_API_KEY = env['LOVABLE_API_KEY'];

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
    // Early exit if API keys are not configured
    if (!LOVABLE_API_KEY || !LOVABLE_API) {
      console.error(
        'LOVABLE_API_KEY or LOVABLE_API not found in environment variables.'
      );
      return new Response(JSON.stringify({ error: 'AI 服務未正確設定。' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { cards, category } = await req.json();

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

    const categoryContext = {
      事業: '事業發展、工作機會、職場關係',
      感情: '愛情關係、感情發展、伴侶互動',
      人際: '人際關係、社交互動、朋友關係',
      綜合: '整體運勢、生活各方面',
      日抽: '今日運勢、當日建議',
    };

    const systemPrompt = `你是一位專業的塔羅牌解讀師。請根據抽到的牌卡和分類提供深入的解析。
      解析應該包括：
      1. 牌卡的基本含義
      2. 在${category}方面的具體解讀
      3. 實用的建議和行動方向
      4. 需要注意的事項

      請用溫暖、專業且易懂的語言，給出約50-100字的解析。
      注意：傳回來的text不要有任何的markdown語法。
    `;

    const userPrompt = `抽到的牌：${cards.join(', ')}
      分類：${category} (${
        categoryContext[category as keyof typeof categoryContext] || '綜合運勢'
      })

請提供詳細的塔羅牌解讀。
注意：傳回來的text不要有任何的markdown語法。
`;

    console.log('Calling Lovable AI with cards:', cards, 'category:', category);

    const response = await fetch(LOVABLE_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: '請求過於頻繁，請稍後再試' }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: '額度不足，請聯繫管理員' }),
          {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const interpretation = data.choices[0].message.content.replace(
      /\*\*(.*?)\*\*/g,
      '$1'
    );

    console.log('Successfully generated interpretation');

    return new Response(JSON.stringify({ interpretation }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in tarot-interpretation function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : '未知錯誤',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
