export interface TarotCard {
  name: string;
  normalImage: string;
  reverseImage?: string; // This can be the same as normalImage if no specific reverse image exists
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
  { id: '1', name: '事業', color: 'hsl(45 100% 65%)' }, //icon: '💼'
  { id: '2', name: '感情', color: 'hsl(280 60% 45%)' }, //icon: '💕'
  { id: '3', name: '人際', color: 'hsl(200 60% 45%)' }, //icon: '👥'
  { id: '4', name: '綜合', color: 'hsl(270 60% 45%)' }, // icon: '🌟'
  { id: '5', name: '日抽', color: 'hsl(30 60% 45%)' }, // icon: '🌅'
];

const majorArcanaPath = '/src/assets/cards/major_arcana/';
const cupsPath = '/src/assets/cards/cups/';
const pentaclesPath = '/src/assets/cards/pentacles/';
const swordsPath = '/src/assets/cards/swords/';
const wandsPath = '/src/assets/cards/wands/';

export const TAROT_CARDS: Record<string, TarotCard> = {
  // Major Arcana
  fool: {
    name: 'The Fool',
    normalImage: `${majorArcanaPath}fool.png`,
    keywords: ['Innocence', 'new beginnings', 'free spirit'],
    meaning:
      'Represents new beginnings, infinite possibilities, and the courage to face the unknown.',
    reverseMeaning: 'Recklessness, carelessness, being taken advantage of.',
  },
  magician: {
    name: 'The Magician',
    normalImage: `${majorArcanaPath}magician.png`,
    keywords: ['Willpower', 'desire', 'creation', 'manifestation'],
    meaning:
      'Represents willpower, skill, and the ability to turn ideas into action.',
    reverseMeaning: 'Trickery, illusions, out of touch, manipulation.',
  },
  priestess: {
    name: 'The High Priestess',
    normalImage: `${majorArcanaPath}priestess.png`,
    keywords: ['Intuition', 'unconscious', 'inner voice'],
    meaning:
      'Represents intuition, sacred knowledge, and the subconscious mind.',
    reverseMeaning:
      'Secrets, disconnected from intuition, withdrawal and silence.',
  },
  empress: {
    name: 'The Empress',
    normalImage: `${majorArcanaPath}empress.png`,
    keywords: ['Femininity', 'beauty', 'nature', 'nurturing'],
    meaning: 'Represents femininity, motherhood, fertility, and abundance.',
    reverseMeaning: 'Creative block, dependence on others, emptiness.',
  },
  emperor: {
    name: 'The Emperor',
    normalImage: `${majorArcanaPath}emperor.png`,
    keywords: ['Authority', 'father-figure', 'structure', 'solid foundation'],
    meaning: 'Represents authority, structure, control, and fatherly energy.',
    reverseMeaning:
      'Domination, excessive control, lack of discipline, inflexibility.',
  },
  hierophant: {
    name: 'The Hierophant',
    normalImage: `${majorArcanaPath}hierophant.png`,
    keywords: [
      'Religion',
      'group identification',
      'conformity',
      'tradition',
      'beliefs',
    ],
    meaning: 'Represents tradition, conformity, and established institutions.',
    reverseMeaning:
      'Rebellion, non-conformity, new approaches, personal beliefs.',
  },
  lovers: {
    name: 'The Lovers',
    normalImage: `${majorArcanaPath}lovers.png`,
    keywords: [
      'Love',
      'harmony',
      'relationships',
      'values alignment',
      'choices',
    ],
    meaning: 'Represents love, relationships, harmony, and important choices.',
    reverseMeaning: 'Disharmony, imbalance, misalignment of values, conflict.',
  },
  chariot: {
    name: 'The Chariot',
    normalImage: `${majorArcanaPath}chariot.png`,
    keywords: ['Control', 'willpower', 'victory', 'assertion', 'determination'],
    meaning:
      'Represents willpower, determination, and overcoming obstacles through self-control.',
    reverseMeaning:
      'Lack of control and direction, aggression, self-discipline.',
  },
  strength: {
    name: 'Strength',
    normalImage: `${majorArcanaPath}strength.png`,
    keywords: ['Strength', 'courage', 'patience', 'control', 'compassion'],
    meaning:
      'Represents inner strength, courage, compassion, and self-control.',
    reverseMeaning:
      'Weakness, self-doubt, lack of self-discipline, raw emotion.',
  },
  hermit: {
    name: 'The Hermit',
    normalImage: `${majorArcanaPath}hermit.png`,
    keywords: [
      'Soul-searching',
      'introspection',
      'being alone',
      'inner guidance',
    ],
    meaning: 'Represents introspection, soul-searching, and inner guidance.',
    reverseMeaning: 'Isolation, loneliness, withdrawal from society.',
  },
  fortune: {
    name: 'Wheel of Fortune',
    normalImage: `${majorArcanaPath}fortune.png`,
    keywords: [
      'Good luck',
      'karma',
      'life cycles',
      'destiny',
      'a turning point',
    ],
    meaning: 'Represents destiny, turning points, and the cycles of life.',
    reverseMeaning: 'Bad luck, resistance to change, breaking cycles.',
  },
  justice: {
    name: 'Justice',
    normalImage: `${majorArcanaPath}justice.png`,
    keywords: ['Justice', 'fairness', 'truth', 'cause and effect', 'law'],
    meaning: 'Represents fairness, truth, and cause and effect.',
    reverseMeaning:
      'Unfairness, lack of accountability, dishonesty, injustice.',
  },
  hanged: {
    name: 'The Hanged Man',
    normalImage: `${majorArcanaPath}hanged.png`,
    keywords: ['Suspension', 'restriction', 'letting go', 'sacrifice'],
    meaning: 'Represents suspension, new perspectives, and sacrifice.',
    reverseMeaning: 'Stalling, needless sacrifice, resistance to letting go.',
  },
  death: {
    name: 'Death',
    normalImage: `${majorArcanaPath}death.png`,
    keywords: ['轉變', '結束', '重生', '循環'],
    meaning: '代表轉變、結束和新的開始，而非字面上的死亡',
    reverseMeaning:
      'Resistance to change, personal transformation, inner purging.',
  },
  temperance: {
    name: 'Temperance',
    normalImage: `${majorArcanaPath}temperance.png`,
    keywords: ['Balance', 'moderation', 'patience', 'purpose'],
    meaning: 'Represents balance, moderation, and finding a middle ground.',
    reverseMeaning: 'Imbalance, excess, extremes, lack of long-term vision.',
  },
  devil: {
    name: 'The Devil',
    normalImage: `${majorArcanaPath}devil.png`,
    keywords: ['Bondage', 'addiction', 'sexuality', 'materialism'],
    meaning:
      'Represents addiction, materialism, and being trapped by your own limitations.',
    reverseMeaning: 'Detachment, breaking free, reclaiming power.',
  },
  tower: {
    name: 'The Tower',
    normalImage: `${majorArcanaPath}tower.png`,
    keywords: ['Sudden change', 'upheaval', 'chaos', 'revelation', 'awakening'],
    meaning: 'Represents sudden upheaval, chaos, and revelation.',
    reverseMeaning:
      'Avoidance of disaster, fear of change, personal transformation.',
  },
  star: {
    name: 'The Star',
    normalImage: `${majorArcanaPath}star.png`,
    keywords: ['希望', '靈感', '指導', '平靜'],
    meaning: '代表希望、靈感和精神上的指導',
    reverseMeaning: 'Lack of faith, despair, discouragement, disconnection.',
  },
  moon: {
    name: 'The Moon',
    normalImage: `${majorArcanaPath}moon.png`,
    keywords: ['Illusion', 'fear', 'anxiety', 'subconscious', 'intuition'],
    meaning: 'Represents illusion, fear, and the subconscious.',
    reverseMeaning: 'Release of fear, repressed emotion, inner confusion.',
  },
  sun: {
    name: 'The Sun',
    normalImage: `${majorArcanaPath}sun.png`,
    keywords: ['Positivity', 'fun', 'warmth', 'success', 'vitality'],
    meaning: 'Represents success, positivity, and vitality.',
    reverseMeaning: 'Inner child, feeling down, overly optimistic.',
  },
  judgement: {
    name: 'Judgement',
    normalImage: `${majorArcanaPath}judgement.png`,
    keywords: ['Judgement', 'rebirth', 'inner calling', 'absolution'],
    meaning:
      'Represents rebirth, a spiritual awakening, and a call to a higher purpose.',
    reverseMeaning: 'Self-doubt, inner critic, ignoring the call.',
  },
  world: {
    name: 'The World',
    normalImage: `${majorArcanaPath}world.png`,
    keywords: ['Completion', 'integration', 'accomplishment', 'travel'],
    meaning: 'Represents completion, accomplishment, and fulfillment.',
    reverseMeaning: 'Incompletion, no closure, short-cuts, delays.',
  },

  // Cups
  cups_ace: {
    name: 'Ace of Cups',
    normalImage: `${cupsPath}cups_ace.png`,
    keywords: [],
    meaning: '',
  },
  cups_2: {
    name: 'Two of Cups',
    normalImage: `${cupsPath}cups_2.png`,
    keywords: [],
    meaning: '',
  },
  cups_3: {
    name: 'Three of Cups',
    normalImage: `${cupsPath}cups_3.png`,
    keywords: [],
    meaning: '',
  },
  cups_4: {
    name: 'Four of Cups',
    normalImage: `${cupsPath}cups_4.png`,
    keywords: [],
    meaning: '',
  },
  cups_5: {
    name: 'Five of Cups',
    normalImage: `${cupsPath}cups_5.png`,
    keywords: [],
    meaning: '',
  },
  cups_6: {
    name: 'Six of Cups',
    normalImage: `${cupsPath}cups_6.png`,
    keywords: [],
    meaning: '',
  },
  cups_7: {
    name: 'Seven of Cups',
    normalImage: `${cupsPath}cups_7.png`,
    keywords: [],
    meaning: '',
  },
  cups_8: {
    name: 'Eight of Cups',
    normalImage: `${cupsPath}cups_8.png`,
    keywords: [],
    meaning: '',
  },
  cups_9: {
    name: 'Nine of Cups',
    normalImage: `${cupsPath}cups_9.png`,
    keywords: [],
    meaning: '',
  },
  cups_10: {
    name: 'Ten of Cups',
    normalImage: `${cupsPath}cups_10.png`,
    keywords: [],
    meaning: '',
  },
  cups_page: {
    name: 'Page of Cups',
    normalImage: `${cupsPath}cups_page.png`,
    keywords: [],
    meaning: '',
  },
  cups_knight: {
    name: 'Knight of Cups',
    normalImage: `${cupsPath}cups_knight.png`,
    keywords: [],
    meaning: '',
  },
  cups_queen: {
    name: 'Queen of Cups',
    normalImage: `${cupsPath}cups_queen.png`,
    keywords: [],
    meaning: '',
  },
  cups_king: {
    name: 'King of Cups',
    normalImage: `${cupsPath}cups_king.png`,
    keywords: [],
    meaning: '',
  },

  // Pentacles
  pentacles_ace: {
    name: 'Ace of Pentacles',
    normalImage: `${pentaclesPath}pentacles_ace.png`,
    keywords: [],
    meaning: '',
  },
  pentacles_2: {
    name: 'Two of Pentacles',
    normalImage: `${pentaclesPath}pentacles_2.png`,
    keywords: [],
    meaning: '',
  },
  pentacles_3: {
    name: 'Three of Pentacles',
    normalImage: `${pentaclesPath}pentacles_3.png`,
    keywords: [],
    meaning: '',
  },
  pentacles_4: {
    name: 'Four of Pentacles',
    normalImage: `${pentaclesPath}pentacles_4.png`,
    keywords: [],
    meaning: '',
  },
  pentacles_5: {
    name: 'Five of Pentacles',
    normalImage: `${pentaclesPath}pentacles_5.png`,
    keywords: [],
    meaning: '',
  },
  pentacles_6: {
    name: 'Six of Pentacles',
    normalImage: `${pentaclesPath}pentacles_6.png`,
    keywords: [],
    meaning: '',
  },
  pentacles_7: {
    name: 'Seven of Pentacles',
    normalImage: `${pentaclesPath}pentacles_7.png`,
    keywords: [],
    meaning: '',
  },
  pentacles_8: {
    name: 'Eight of Pentacles',
    normalImage: `${pentaclesPath}pentacles_8.png`,
    keywords: [],
    meaning: '',
  },
  pentacles_9: {
    name: 'Nine of Pentacles',
    normalImage: `${pentaclesPath}pentacles_9.png`,
    keywords: [],
    meaning: '',
  },
  pentacles_10: {
    name: 'Ten of Pentacles',
    normalImage: `${pentaclesPath}pentacles_10.png`,
    keywords: [],
    meaning: '',
  },
  pentacles_page: {
    name: 'Page of Pentacles',
    normalImage: `${pentaclesPath}pentacles_page.png`,
    keywords: [],
    meaning: '',
  },
  pentacles_knight: {
    name: 'Knight of Pentacles',
    normalImage: `${pentaclesPath}pentacles_knight.png`,
    keywords: [],
    meaning: '',
  },
  pentacles_queen: {
    name: 'Queen of Pentacles',
    normalImage: `${pentaclesPath}pentacles_queen.png`,
    keywords: [],
    meaning: '',
  },
  pentacles_king: {
    name: 'King of Pentacles',
    normalImage: `${pentaclesPath}pentacles_king.png`,
    keywords: [],
    meaning: '',
  },

  // Swords
  swords_ace: {
    name: 'Ace of Swords',
    normalImage: `${swordsPath}swords_ace.png`,
    keywords: [],
    meaning: '',
  },
  swords_2: {
    name: 'Two of Swords',
    normalImage: `${swordsPath}swords_2.png`,
    keywords: [],
    meaning: '',
  },
  swords_3: {
    name: 'Three of Swords',
    normalImage: `${swordsPath}swords_3.png`,
    keywords: [],
    meaning: '',
  },
  swords_4: {
    name: 'Four of Swords',
    normalImage: `${swordsPath}swords_4.png`,
    keywords: [],
    meaning: '',
  },
  swords_5: {
    name: 'Five of Swords',
    normalImage: `${swordsPath}swords_5.png`,
    keywords: [],
    meaning: '',
  },
  swords_6: {
    name: 'Six of Swords',
    normalImage: `${swordsPath}swords_6.png`,
    keywords: [],
    meaning: '',
  },
  swords_7: {
    name: 'Seven of Swords',
    normalImage: `${swordsPath}swords_7.png`,
    keywords: [],
    meaning: '',
  },
  swords_8: {
    name: 'Eight of Swords',
    normalImage: `${swordsPath}swords_8.png`,
    keywords: [],
    meaning: '',
  },
  swords_9: {
    name: 'Nine of Swords',
    normalImage: `${swordsPath}swords_9.png`,
    keywords: [],
    meaning: '',
  },
  swords_10: {
    name: 'Ten of Swords',
    normalImage: `${swordsPath}swords_10.png`,
    keywords: [],
    meaning: '',
  },
  swords_page: {
    name: 'Page of Swords',
    normalImage: `${swordsPath}swords_page.png`,
    keywords: [],
    meaning: '',
  },
  swords_knight: {
    name: 'Knight of Swords',
    normalImage: `${swordsPath}swords_knight.png`,
    keywords: [],
    meaning: '',
  },
  swords_queen: {
    name: 'Queen of Swords',
    normalImage: `${swordsPath}swords_queen.png`,
    keywords: [],
    meaning: '',
  },
  swords_king: {
    name: 'King of Swords',
    normalImage: `${swordsPath}swords_king.png`,
    keywords: [],
    meaning: '',
  },

  // Wands
  wands_ace: {
    name: 'Ace of Wands',
    normalImage: `${wandsPath}wands_ace.png`,
    keywords: [],
    meaning: '',
  },
  wands_2: {
    name: 'Two of Wands',
    normalImage: `${wandsPath}wands_2.png`,
    keywords: [],
    meaning: '',
  },
  wands_3: {
    name: 'Three of Wands',
    normalImage: `${wandsPath}wands_3.png`,
    keywords: [],
    meaning: '',
  },
  wands_4: {
    name: 'Four of Wands',
    normalImage: `${wandsPath}wands_4.png`,
    keywords: [],
    meaning: '',
  },
  wands_5: {
    name: 'Five of Wands',
    normalImage: `${wandsPath}wands_5.png`,
    keywords: [],
    meaning: '',
  },
  wands_6: {
    name: 'Six of Wands',
    normalImage: `${wandsPath}wands_6.png`,
    keywords: [],
    meaning: '',
  },
  wands_7: {
    name: 'Seven of Wands',
    normalImage: `${wandsPath}wands_7.png`,
    keywords: [],
    meaning: '',
  },
  wands_8: {
    name: 'Eight of Wands',
    normalImage: `${wandsPath}wands_8.png`,
    keywords: [],
    meaning: '',
  },
  wands_9: {
    name: 'Nine of Wands',
    normalImage: `${wandsPath}wands_9.png`,
    keywords: [],
    meaning: '',
  },
  wands_10: {
    name: 'Ten of Wands',
    normalImage: `${wandsPath}wands_10.png`,
    keywords: [],
    meaning: '',
  },
  wands_page: {
    name: 'Page of Wands',
    normalImage: `${wandsPath}wands_page.png`,
    keywords: [],
    meaning: '',
  },
  wands_knight: {
    name: 'Knight of Wands',
    normalImage: `${wandsPath}wands_knight.png`,
    keywords: [],
    meaning: '',
  },
  wands_queen: {
    name: 'Queen of Wands',
    normalImage: `${wandsPath}wands_queen.png`,
    keywords: [],
    meaning: '',
  },
  wands_king: {
    name: 'King of Wands',
    normalImage: `${wandsPath}wands_king.png`,
    keywords: [],
    meaning: '',
  },
};
