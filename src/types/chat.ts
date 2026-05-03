
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  journal_id: string;
  messages: ChatMessage[];
  created_at: string;
}

export interface OracleConfig {
  personality: 'mystic' | 'psychological' | 'practical';
  language: 'zh-TW' | 'en';
}
