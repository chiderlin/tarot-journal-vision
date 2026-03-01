export interface EmotionConfig {
  name: string;
  icon: string;
  color: string;
  keywords?: string[];
}

export const EMOTIONS: Record<string, EmotionConfig> = {
  happy: {
    name: '快樂',
    icon: 'Smile',
    color: '#FFD700',
    keywords: ['開心', '滿足', '充實'],
  },
  sad: {
    name: '悲傷',
    icon: 'Frown',
    color: '#4A90E2',
    keywords: ['難受', '失落', '寂寞'],
  },
  anxious: {
    name: '焦慮',
    icon: 'AlertCircle',
    color: '#FF6B6B',
    keywords: ['緊張', '不安', '擔心'],
  },
  calm: {
    name: '平靜',
    icon: 'Flower2',
    color: '#95E1D3',
    keywords: ['安定', '放鬆', '清晰'],
  },
  confused: {
    name: '困惑',
    icon: 'HelpCircle',
    color: '#F5A623',
    keywords: ['迷茫', '無所適從', '疑惑'],
  },
  grateful: {
    name: '感恩',
    icon: 'Heart',
    color: '#7ED321',
    keywords: ['感謝', '感恩', '珍惜'],
  },
  energetic: {
    name: '精力充沛',
    icon: 'Zap',
    color: '#FF4081',
    keywords: ['有衝勁', '興奮', '動力'],
  },
  neutral: {
    name: '中立',
    icon: 'Minus',
    color: '#999999',
    keywords: ['平常', '無特別感受'],
  },
} as const;

export type EmotionKey = keyof typeof EMOTIONS;
export const EMOTION_KEYS = Object.keys(EMOTIONS) as EmotionKey[];
export const MAX_EMOTIONS = 3;
