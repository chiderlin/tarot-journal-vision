
import { GoogleGenerativeAI } from '@google/generative-ai';
import i18next from 'i18next';
import { ChatMessage, OracleConfig } from '../types/chat';

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

export const generateDailyGuidance = async () => {
  if (!apiKey) {
    throw new Error('Google AI Key is not configured.');
  }
  
  const currentLang = i18next.language || 'en';
  const language = currentLang.startsWith('zh') ? 'zh-TW' : 'en';

  const prompt = `
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

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating daily guidance:', error);
    throw error;
  }

};

export const chatWithOracle = async (
  messages: ChatMessage[],
  cards: string[],
  context: string,
  config?: Partial<OracleConfig>
) => {
  if (!apiKey) {
    throw new Error('Google AI Key is not configured.');
  }

  const currentLang = i18next.language || 'en';
  const language = config?.language || (currentLang.startsWith('zh') ? 'zh-TW' : 'en');
  const personality = config?.personality || 'psychological'; // Default to something more grounded

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
  `;

  // Filter messages to match Gemini's API format { role: 'user' | 'model', parts: [{ text: string }] }
  let history = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  // Gemini requires the first message to be from 'user'
  if (history.length > 0 && history[0].role === 'model') {
    history = [
      {
        role: 'user',
        parts: [{ text: `I have drawn these cards: ${cards.join(', ')}. Context: ${context}. Please interpret them.` }]
      },
      ...history
    ];
  }

  const lastMessage = messages[messages.length - 1].content;

  try {
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 2000, // 2000 tokens is plenty for a detailed response
      },
    });

    // Send the system instruction as a prompt if it's the first message, 
    // or include it in the context of the last message for better adherence.
    const fullPrompt = `System Context: ${systemInstruction}\n\nUser Question: ${lastMessage}`;

    const result = await chat.sendMessage(fullPrompt);
    const response = await result.response;
    console.log(response)
    return response.text();
  } catch (error) {
    console.error('Error in chatWithOracle:', error);
    throw error;
  }
};
