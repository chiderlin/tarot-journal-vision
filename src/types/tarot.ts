export interface TarotCard {
  name: string;
  normalImage: string;
  reverseImage?: string;
  keywords: string[];
  meaning: string;
  reverseMeaning?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  cards: string[]; // Array of card names that appear in this entry
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '事業', color: 'hsl(45 100% 65%)', icon: '💼' },
  { id: '2', name: '感情', color: 'hsl(280 60% 45%)', icon: '💕' },
  { id: '3', name: '人際', color: 'hsl(200 60% 45%)', icon: '👥' },
  { id: '4', name: '綜合', color: 'hsl(270 60% 45%)', icon: '🌟' },
  { id: '5', name: '日抽', color: 'hsl(30 60% 45%)', icon: '🌅' },
];

export const TAROT_CARDS: Record<string, TarotCard> = {
  fool: {
    name: 'The Fool',
    normalImage: '/src/assets/tarot-fool.jpg',
    keywords: ['新開始', '自由', '冒險', '天真'],
    meaning: '代表新的開始、無限的可能性和對未知的勇氣',
  },
  magician: {
    name: 'The Magician',
    normalImage: '/src/assets/tarot-magician.jpg',
    keywords: ['力量', '技能', '專注', '創造'],
    meaning: '代表意志力、技能和將想法付諸行動的能力',
  },
  death: {
    name: 'Death',
    normalImage: '/src/assets/tarot-death.jpg',
    keywords: ['轉變', '結束', '重生', '循環'],
    meaning: '代表轉變、結束和新的開始，而非字面上的死亡',
  },
  star: {
    name: 'The Star',
    normalImage: '/src/assets/tarot-star.jpg',
    keywords: ['希望', '靈感', '指導', '平靜'],
    meaning: '代表希望、靈感和精神上的指導',
  },
};