import i18next from 'i18next';
import { ChatMessage, OracleConfig } from '../types/chat';
import { supabase } from '@/integrations/supabase/client';

interface AIInput {
  question?: string;
  cards: string[]; // List of card names, e.g., "The Fool", "Ace of Cups (Reversed)"
  context?: string; // e.g. "Love", "Career"
}

/**
 * 🔮 1. 塔羅/雷諾曼 抽牌解析
 */
export const getTarotInterpretation = async ({ question, cards, context }: AIInput) => {
  const currentLang = i18next.language || 'en';
  const language = currentLang.startsWith('zh') ? 'zh-TW' : 'en';
  
  console.log('AI Service - Invoking secure Edge Function for interpretation:', cards);

  const { data, error } = await supabase.functions.invoke('tarot-interpretation', {
    body: {
      action: 'interpret',
      question,
      cards,
      context,
      language
    }
  });

  if (error) {
    console.error('Error calling secure Edge Function:', error);
    throw new Error(error.message || 'AI 服務解讀失敗，請稍後再試');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data.result;
};

/**
 * ☀️ 2. 每日指引 (今日宜) 生成
 */
export const generateDailyGuidance = async () => {
  const currentLang = i18next.language || 'en';
  const language = currentLang.startsWith('zh') ? 'zh-TW' : 'en';

  console.log('AI Service - Invoking secure Edge Function for daily guidance');

  const { data, error } = await supabase.functions.invoke('tarot-interpretation', {
    body: {
      action: 'guidance',
      language
    }
  });

  if (error) {
    console.error('Error generating daily guidance:', error);
    throw new Error(error.message || '無法取得每日指引，請稍後再試');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data.result.trim();
};

/**
 * 💬 3. 與祭司 (The Oracle) 進行塔羅對話
 */
export const chatWithOracle = async (
  messages: ChatMessage[],
  cards: string[],
  context: string,
  config?: Partial<OracleConfig>
) => {
  const currentLang = i18next.language || 'en';
  const language = config?.language || (currentLang.startsWith('zh') ? 'zh-TW' : 'en');

  console.log('AI Service - Invoking secure Edge Function for Oracle chat');

  const { data, error } = await supabase.functions.invoke('tarot-interpretation', {
    body: {
      action: 'chat',
      messages,
      cards,
      context,
      config: {
        ...config,
        language
      },
      language
    }
  });

  if (error) {
    console.error('Error in chatWithOracle:', error);
    throw new Error(error.message || '祭司目前正在冥想中，請稍後再試');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data.result;
};
