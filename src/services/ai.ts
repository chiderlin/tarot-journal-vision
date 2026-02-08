
import { GoogleGenerativeAI } from '@google/generative-ai';
import i18next from 'i18next';

// Initialize the API client
const apiKey = import.meta.env.VITE_GOOGLE_AI_KEY || import.meta.env.GOOGLE_AI_KEY;

if (!apiKey) {
  console.warn('Missing VITE_GOOGLE_AI_KEY in environment variables.');
  console.log('Current Env Vars:', import.meta.env); // Debugging
} else {
    console.log('Gemini API Key Loaded. Length:', apiKey.length);
}

const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

interface AIInput {
  question?: string;
  cards: string[]; // List of card names, e.g., "The Fool", "Ace of Cups (Reversed)"
  context?: string; // e.g. "Love", "Career"
}

export const getTarotInterpretation = async ({ question, cards, context }: AIInput) => {
  if (!apiKey) {
    throw new Error('Google AI Key is not configured.');
  }

  // Detect language more robustly
  const currentLang = i18next.language || 'en';
  const language = currentLang.startsWith('zh') ? 'zh-TW' : 'en';
  
  console.log('AI Service - Detected Language:', currentLang, '-> Requesting:', language);

  const prompt = `
  Role Definition
  You are an expert Tarot Reader with a deep understanding of Rider-Waite symbolism, Jungian psychology, and constructive counseling. Your tone is empathetic, insightful, and empowering—never fatalistic.
  
  Input Format
  1. Question: ${question || 'General Reading'}
  2. Context: ${context || 'General'}
  3. Spread:
  ${cards.map((card, index) => `   - Position ${index + 1}: ${card}`).join('\n')}
  4. Language: ${language}
  
  Output Instructions
  Please analyze the spread and provide a response in the following **Markdown** structure.
  **IMPORTANT:** The response MUST be in the same language as the Language specified in the input. If zh-TW is specified, use Traditional Chinese. If en is specified, use English.
  
  Keep the total length concise (under 300 words) but impactful.
  
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

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
