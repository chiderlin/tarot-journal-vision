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
    keywords: ['Endings', 'change', 'transformation', 'transition'],
    meaning:
      'Represents an end, transformation, and new beginnings, not literal death.',
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
    keywords: ['Hope', 'faith', 'purpose', 'rejuvenation'],
    meaning: 'Represents hope, inspiration, and spiritual guidance.',
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
    keywords: ['Love', 'new feelings', 'compassion', 'creativity'],
    meaning:
      'Represents new beginnings in love, emotions, and creativity. A new relationship or a deeper connection is emerging.',
    reverseMeaning: 'Emotional blockage, repressed feelings, emptiness.',
  },
  cups_2: {
    name: 'Two of Cups',
    normalImage: `${cupsPath}cups_2.png`,
    keywords: ['Partnership', 'mutual attraction', 'connection'],
    meaning:
      'Represents a deep connection, partnership, and mutual respect. It often signifies a romantic relationship but can also be a strong friendship or business partnership.',
    reverseMeaning: 'Break-up, disharmony, distrust.',
  },
  cups_3: {
    name: 'Three of Cups',
    normalImage: `${cupsPath}cups_3.png`,
    keywords: ['Celebration', 'friendship', 'creativity', 'collaborations'],
    meaning:
      "Represents celebrations, friendship, and creative collaborations. It's a time of happy gatherings and shared joy.",
    reverseMeaning: 'An affair, "three\'s a crowd", isolation, gossip.',
  },
  cups_4: {
    name: 'Four of Cups',
    normalImage: `${cupsPath}cups_4.png`,
    keywords: ['Apathy', 'contemplation', 'disconnectedness', 'meditation'],
    meaning:
      "Represents apathy, contemplation, and being offered something that doesn't excite you. A need to re-evaluate.",
    reverseMeaning:
      'Sudden awareness, choosing happiness, letting go of regret, ending boredom.',
  },
  cups_5: {
    name: 'Five of Cups',
    normalImage: `${cupsPath}cups_5.png`,
    keywords: ['Loss', 'regret', 'disappointment', 'sadness'],
    meaning:
      'Represents loss, regret, and focusing on what has gone wrong rather than the opportunities that remain.',
    reverseMeaning:
      'Moving on, acceptance, finding forgiveness, seeing the positive.',
  },
  cups_6: {
    name: 'Six of Cups',
    normalImage: `${cupsPath}cups_6.png`,
    keywords: ['Nostalgia', 'happy memories', 'reunion', 'innocence'],
    meaning:
      'Represents nostalgia, childhood memories, and the happiness of the past. It can also mean a reunion with someone from your past.',
    reverseMeaning:
      'Stuck in the past, moving forward, leaving home, rose-tinted glasses.',
  },
  cups_7: {
    name: 'Seven of Cups',
    normalImage: `${cupsPath}cups_7.png`,
    keywords: ['Choices', 'illusions', 'fantasy', 'wishful thinking'],
    meaning:
      'Represents having many choices and opportunities, but also the danger of illusion, fantasy, and wishful thinking.',
    reverseMeaning:
      'Temptation, illusion, diversionary tactics, lack of purpose.',
  },
  cups_8: {
    name: 'Eight of Cups',
    normalImage: `${cupsPath}cups_8.png`,
    keywords: ['Walking away', 'disillusionment', 'leaving something behind'],
    meaning:
      'Represents walking away from a situation that is no longer emotionally fulfilling. A journey of self-discovery.',
    reverseMeaning:
      'Trying one more time, indecision, aimless drifting, fear of the unknown.',
  },
  cups_9: {
    name: 'Nine of Cups',
    normalImage: `${cupsPath}cups_9.png`,
    keywords: ['Wishes fulfilled', 'comfort', 'happiness', 'satisfaction'],
    meaning:
      'Often called the "wish card," it represents satisfaction, contentment, and wishes coming true.',
    reverseMeaning:
      'Greed, dissatisfaction, materialism, unrealistic expectations.',
  },
  cups_10: {
    name: 'Ten of Cups',
    normalImage: `${cupsPath}cups_10.png`,
    keywords: ['Lasting happiness', 'harmony', 'marriage', 'family'],
    meaning:
      'Represents ultimate emotional fulfillment, happy family life, and harmonious relationships.',
    reverseMeaning:
      'Broken home or marriage, disharmony, unhappiness, misalignment of values.',
  },
  cups_page: {
    name: 'Page of Cups',
    normalImage: `${cupsPath}cups_page.png`,
    keywords: [
      'Creative opportunities',
      'curiosity',
      'possibility',
      'sensitivity',
    ],
    meaning:
      'Represents a messenger of creative opportunities and emotional messages. A time for curiosity and intuition.',
    reverseMeaning:
      'New ideas, doubting intuition, creative blocks, emotional immaturity.',
  },
  cups_knight: {
    name: 'Knight of Cups',
    normalImage: `${cupsPath}cups_knight.png`,
    keywords: ['Romance', 'charm', 'knight in shining armor', 'imagination'],
    meaning:
      "Represents romance, charm, and following one's heart. He is a messenger of love and creative inspiration.",
    reverseMeaning: 'Unrealistic, jealousy, moodiness, disappointment.',
  },
  cups_queen: {
    name: 'Queen of Cups',
    normalImage: `${cupsPath}cups_queen.png`,
    keywords: ['Compassionate', 'caring', 'emotionally stable', 'intuitive'],
    meaning:
      'Represents a compassionate, intuitive, and emotionally mature person. She is in tune with her feelings and those of others.',
    reverseMeaning:
      'Emotional insecurity, co-dependency, martyrdom, being over-sensitive.',
  },
  cups_king: {
    name: 'King of Cups',
    normalImage: `${cupsPath}cups_king.png`,
    keywords: [
      'Emotionally balanced',
      'compassionate',
      'diplomatic',
      'control',
    ],
    meaning:
      'Represents emotional mastery, compassion, and diplomacy. He is a master of his own feelings and a calm influence on others.',
    reverseMeaning:
      'Emotional manipulation, moodiness, volatility, selfishness.',
  },

  // Pentacles
  pentacles_ace: {
    name: 'Ace of Pentacles',
    normalImage: `${pentaclesPath}pentacles_ace.png`,
    keywords: ['New opportunity', 'manifestation', 'prosperity'],
    meaning:
      'Represents a new opportunity for prosperity, abundance, and manifestation. A seed of wealth has been planted.',
    reverseMeaning: 'Lost opportunity, lack of planning, greed, missed chance.',
  },
  pentacles_2: {
    name: 'Two of Pentacles',
    normalImage: `${pentaclesPath}pentacles_2.png`,
    keywords: ['Juggling', 'prioritization', 'adaptability', 'balance'],
    meaning:
      'Represents balancing priorities, adapting to change, and managing resources. Often involves juggling multiple tasks or financial matters.',
    reverseMeaning:
      'Over-committed, disorganization, reprioritization, financial mess.',
  },
  pentacles_3: {
    name: 'Three of Pentacles',
    normalImage: `${pentaclesPath}pentacles_3.png`,
    keywords: ['Teamwork', 'collaboration', 'learning', 'implementation'],
    meaning:
      'Represents teamwork, collaboration, and the successful completion of the initial phase of a project. Your skills are recognized.',
    reverseMeaning:
      'Disharmony, misalignment, working alone, poor quality work.',
  },
  pentacles_4: {
    name: 'Four of Pentacles',
    normalImage: `${pentaclesPath}pentacles_4.png`,
    keywords: ['Saving money', 'security', 'conservatism', 'scarcity mindset'],
    meaning:
      'Represents a desire for security and control, often through saving money or holding on tightly to possessions. Can indicate a scarcity mindset.',
    reverseMeaning:
      'Over-spending, greed, self-protection, letting go of control.',
  },
  pentacles_5: {
    name: 'Five of Pentacles',
    normalImage: `${pentaclesPath}pentacles_5.png`,
    keywords: ['Financial loss', 'poverty', 'isolation', 'worry'],
    meaning:
      'Represents financial hardship, poverty, and feeling left out in the cold. A time of worry and insecurity.',
    reverseMeaning:
      'Recovery from financial loss, spiritual poverty, forgiveness.',
  },
  pentacles_6: {
    name: 'Six of Pentacles',
    normalImage: `${pentaclesPath}pentacles_6.png`,
    keywords: [
      'Charity',
      'generosity',
      'sharing wealth',
      'giving and receiving',
    ],
    meaning:
      'Represents generosity, charity, and the flow of giving and receiving. It can mean receiving a gift or being in a position to help others.',
    reverseMeaning: 'Debt, selfishness, one-sided charity, strings attached.',
  },
  pentacles_7: {
    name: 'Seven of Pentacles',
    normalImage: `${pentaclesPath}pentacles_7.png`,
    keywords: [
      'Long-term view',
      'sustainable results',
      'perseverance',
      'patience',
    ],
    meaning:
      'Represents a moment of reflection on a long-term project. A time to assess your progress and decide if the investment is paying off.',
    reverseMeaning:
      'Lack of long-term vision, limited success or reward, impatience.',
  },
  pentacles_8: {
    name: 'Eight of Pentacles',
    normalImage: `${pentaclesPath}pentacles_8.png`,
    keywords: ['Apprenticeship', 'refinement', 'mastery', 'skill development'],
    meaning:
      'Represents dedication to a craft, skill development, and mastery through hard work and attention to detail.',
    reverseMeaning:
      'Perfectionism, misdirected activity, lack of ambition, repetitive tasks.',
  },
  pentacles_9: {
    name: 'Nine of Pentacles',
    normalImage: `${pentaclesPath}pentacles_9.png`,
    keywords: [
      'Abundance',
      'luxury',
      'self-sufficiency',
      'financial independence',
    ],
    meaning:
      'Represents luxury, self-sufficiency, and enjoying the fruits of your labor. Financial independence and refined taste.',
    reverseMeaning:
      'Financial dependency, superficiality, over-spending, hustling.',
  },
  pentacles_10: {
    name: 'Ten of Pentacles',
    normalImage: `${pentaclesPath}pentacles_10.png`,
    keywords: ['Wealth', 'financial security', 'family', 'long-term success'],
    meaning:
      'Represents long-term financial security, family wealth, and a lasting legacy. The culmination of success.',
    reverseMeaning: 'Financial failure, loneliness, loss, fleeting success.',
  },
  pentacles_page: {
    name: 'Page of Pentacles',
    normalImage: `${pentaclesPath}pentacles_page.png`,
    keywords: [
      'New job',
      'financial opportunity',
      'manifestation',
      'diligence',
    ],
    meaning:
      'Represents a new opportunity related to finances, work, or manifestation. A diligent and curious student.',
    reverseMeaning:
      'Lack of progress, procrastination, learn from failure, daydreaming.',
  },
  pentacles_knight: {
    name: 'Knight of Pentacles',
    normalImage: `${pentaclesPath}pentacles_knight.png`,
    keywords: ['Hard work', 'productivity', 'routine', 'conservatism'],
    meaning:
      'Represents a methodical, hard-working, and reliable person. He achieves success through routine and persistence.',
    reverseMeaning: 'Laziness, boredom, feeling "stuck", stagnation.',
  },
  pentacles_queen: {
    name: 'Queen of Pentacles',
    normalImage: `${pentaclesPath}pentacles_queen.png`,
    keywords: [
      'Nurturing',
      'practical',
      'providing financially',
      'a working parent',
    ],
    meaning:
      'Represents a nurturing, practical, and down-to-earth person who provides for others. She is resourceful and creates a warm home environment.',
    reverseMeaning:
      'Financial independence, self-care, work-home conflict, smothering.',
  },
  pentacles_king: {
    name: 'King of Pentacles',
    normalImage: `${pentaclesPath}pentacles_king.png`,
    keywords: ['Wealth', 'business', 'leadership', 'security'],
    meaning:
      'Represents an enterprising and successful leader who has achieved wealth and abundance through discipline and hard work.',
    reverseMeaning:
      'Financially inept, obsessed with wealth and status, stubborn, corrupt.',
  },

  // Swords
  swords_ace: {
    name: 'Ace of Swords',
    normalImage: `${swordsPath}swords_ace.png`,
    keywords: ['Breakthroughs', 'new ideas', 'mental clarity', 'success'],
    meaning:
      'Represents a new idea, a breakthrough in understanding, or a moment of mental clarity. The power of intellect to cut through confusion.',
    reverseMeaning: 'Confusion, chaos, lack of clarity, clouded judgment.',
  },
  swords_2: {
    name: 'Two of Swords',
    normalImage: `${swordsPath}swords_2.png`,
    keywords: [
      'Difficult choices',
      'indecision',
      'stalemate',
      'blocked emotions',
    ],
    meaning:
      'Represents a stalemate or a difficult choice. A need to make a decision, but feeling blocked or unable to see the truth.',
    reverseMeaning:
      'Indecision, confusion, information overload, seeing the truth.',
  },
  swords_3: {
    name: 'Three of Swords',
    normalImage: `${swordsPath}swords_3.png`,
    keywords: ['Heartbreak', 'emotional pain', 'sorrow', 'grief'],
    meaning:
      'Represents heartbreak, sorrow, and painful truth. A moment of deep emotional pain that leads to understanding.',
    reverseMeaning:
      'Negative self-talk, releasing pain, optimism, forgiveness.',
  },
  swords_4: {
    name: 'Four of Swords',
    normalImage: `${swordsPath}swords_4.png`,
    keywords: ['Rest', 'relaxation', 'meditation', 'recuperation'],
    meaning:
      'Represents a need for rest, contemplation, and recuperation. A time to withdraw and recharge your mental batteries.',
    reverseMeaning: 'Exhaustion, burn-out, deep contemplation, stagnation.',
  },
  swords_5: {
    name: 'Five of Swords',
    normalImage: `${swordsPath}swords_5.png`,
    keywords: ['Conflict', 'disagreements', 'competition', 'defeat'],
    meaning:
      'Represents conflict, defeat, and winning at all costs. A situation where ambition leads to discord and loss for others.',
    reverseMeaning:
      'Reconciliation, making amends, past resentment, desire to end conflict.',
  },
  swords_6: {
    name: 'Six of Swords',
    normalImage: `${swordsPath}swords_6.png`,
    keywords: ['Transition', 'change', 'rite of passage', 'releasing baggage'],
    meaning:
      'Represents a transition, moving from a difficult situation to a calmer one. A journey towards a better future.',
    reverseMeaning:
      'Personal transition, resistance to change, unfinished business, trapped.',
  },
  swords_7: {
    name: 'Seven of Swords',
    normalImage: `${swordsPath}swords_7.png`,
    keywords: [
      'Betrayal',
      'deception',
      'getting away with something',
      'strategy',
    ],
    meaning:
      'Represents deception, strategy, and trying to get away with something. It can indicate betrayal or acting alone.',
    reverseMeaning:
      'Imposter syndrome, deceiving yourself, keeping secrets, coming clean.',
  },
  swords_8: {
    name: 'Eight of Swords',
    normalImage: `${swordsPath}swords_8.png`,
    keywords: [
      'Negative thoughts',
      'self-imposed restriction',
      'imprisonment',
      'victim mentality',
    ],
    meaning:
      'Represents feeling trapped and restricted, but these limitations are self-imposed. A need to change your perspective to find freedom.',
    reverseMeaning:
      'Self-acceptance, new perspective, releasing negative thoughts, freedom.',
  },
  swords_9: {
    name: 'Nine of Swords',
    normalImage: `${swordsPath}swords_9.png`,
    keywords: ['Anxiety', 'worry', 'fear', 'depression'],
    meaning:
      'Represents anxiety, fear, and nightmares. A card of deep mental anguish and worry, often worse in the mind than in reality.',
    reverseMeaning:
      'Inner turmoil, deep-seated fears, secrets, releasing worry.',
  },
  swords_10: {
    name: 'Ten of Swords',
    normalImage: `${swordsPath}swords_10.png`,
    keywords: ['Painful endings', 'deep wounds', 'betrayal', 'crisis'],
    meaning:
      'Represents a painful ending, betrayal, and hitting rock bottom. While devastating, it signals the end of a cycle and the chance for rebirth.',
    reverseMeaning:
      'Recovery, regeneration, resisting an inevitable end, learning from the past.',
  },
  swords_page: {
    name: 'Page of Swords',
    normalImage: `${swordsPath}swords_page.png`,
    keywords: [
      'New ideas',
      'curiosity',
      'thirst for knowledge',
      'communication',
    ],
    meaning:
      'Represents a curious, energetic, and communicative person with a thirst for knowledge. A time for new ideas and speaking your truth.',
    reverseMeaning:
      'Self-expression, all talk and no action, haphazard action, gossip.',
  },
  swords_knight: {
    name: 'Knight of Swords',
    normalImage: `${swordsPath}swords_knight.png`,
    keywords: [
      'Ambitious',
      'action-oriented',
      'driven to succeed',
      'fast-thinking',
    ],
    meaning:
      'Represents an ambitious, fast-thinking, and action-oriented person who charges forward to achieve their goals.',
    reverseMeaning: 'Restless, unfocused, impulsive, burn-out, aggressive.',
  },
  swords_queen: {
    name: 'Queen of Swords',
    normalImage: `${swordsPath}swords_queen.png`,
    keywords: [
      'Independent',
      'unbiased judgement',
      'clear boundaries',
      'direct communication',
    ],
    meaning:
      'Represents an independent, intelligent, and clear-thinking person who uses unbiased judgment and sets firm boundaries.',
    reverseMeaning:
      'Overly-emotional, easily influenced, bitchy, cold-hearted.',
  },
  swords_king: {
    name: 'King of Swords',
    normalImage: `${swordsPath}swords_king.png`,
    keywords: ['Mental clarity', 'intellectual power', 'authority', 'truth'],
    meaning:
      'Represents intellectual authority, truth, and mental clarity. A master of logic and reason who rules with fairness.',
    reverseMeaning:
      'Quiet power, inner truth, misuse of power, manipulation, tyrannical.',
  },

  // Wands
  wands_ace: {
    name: 'Ace of Wands',
    normalImage: `${wandsPath}wands_ace.png`,
    keywords: ['Inspiration', 'new opportunities', 'growth', 'potential'],
    meaning:
      'Represents a spark of inspiration, new opportunities, and the potential for growth. A time to take action and pursue your passion.',
    reverseMeaning:
      'An emerging idea, lack of direction, distractions, delays.',
  },
  wands_2: {
    name: 'Two of Wands',
    normalImage: `${wandsPath}wands_2.png`,
    keywords: ['Future planning', 'progress', 'decisions', 'discovery'],
    meaning:
      'Represents future planning, making decisions, and discovering your path. You have achieved something and are now looking to the future.',
    reverseMeaning:
      'Fear of unknown, lack of planning, personal goals, playing it safe.',
  },
  wands_3: {
    name: 'Three of Wands',
    normalImage: `${wandsPath}wands_3.png`,
    keywords: ['Progress', 'expansion', 'foresight', 'overseas opportunities'],
    meaning:
      'Represents progress, expansion, and looking ahead with foresight. Your plans are coming to fruition.',
    reverseMeaning:
      'Playing small, lack of foresight, unexpected delays, obstacles to long-term goals.',
  },
  wands_4: {
    name: 'Four of Wands',
    normalImage: `${wandsPath}wands_4.png`,
    keywords: ['Celebration', 'joy', 'harmony', 'relaxation'],
    meaning:
      'Represents celebration, harmony, and a happy homecoming. A time of joy and stability.',
    reverseMeaning:
      'Personal celebration, inner harmony, conflict with others, transition.',
  },
  wands_5: {
    name: 'Five of Wands',
    normalImage: `${wandsPath}wands_5.png`,
    keywords: ['Conflict', 'disagreements', 'competition', 'tension'],
    meaning:
      'Represents conflict, competition, and disagreements. A clash of ideas and opinions, but often in a low-stakes or creative context.',
    reverseMeaning:
      'Inner conflict, conflict avoidance, striving for harmony, releasing tension.',
  },
  wands_6: {
    name: 'Six of Wands',
    normalImage: `${wandsPath}wands_6.png`,
    keywords: ['Public recognition', 'victory', 'progress', 'self-confidence'],
    meaning:
      'Represents victory, public recognition, and success. You have overcome challenges and are being celebrated for your achievements.',
    reverseMeaning:
      'Private achievement, personal definition of success, fall from grace, egotism.',
  },
  wands_7: {
    name: 'Seven of Wands',
    normalImage: `${wandsPath}wands_7.png`,
    keywords: [
      'Challenge',
      'competition',
      'perseverance',
      'maintaining control',
    ],
    meaning:
      'Represents standing your ground, defending your position, and persevering through challenges.',
    reverseMeaning:
      'Giving up, overwhelmed, overly protective, feeling attacked.',
  },
  wands_8: {
    name: 'Eight of Wands',
    normalImage: `${wandsPath}wands_8.png`,
    keywords: ['Movement', 'action', 'alignment', 'swift change'],
    meaning:
      'Represents rapid movement, action, and communication. Things are happening quickly and progress is being made.',
    reverseMeaning: 'Delays, frustration, resisting change, slowing down.',
  },
  wands_9: {
    name: 'Nine of Wands',
    normalImage: `${wandsPath}wands_9.png`,
    keywords: ['Resilience', 'courage', 'persistence', 'boundaries'],
    meaning:
      'Represents resilience, courage, and persistence in the face of adversity. You are wounded but not defeated.',
    reverseMeaning:
      'Inner resources, struggle, overwhelm, defensive, paranoia.',
  },
  wands_10: {
    name: 'Ten of Wands',
    normalImage: `${wandsPath}wands_10.png`,
    keywords: ['Burden', 'extra responsibility', 'hard work', 'completion'],
    meaning:
      'Represents carrying a heavy burden, taking on too much responsibility, and the stress of hard work.',
    reverseMeaning: 'Doing it all, carrying the burden, delegation, release.',
  },
  wands_page: {
    name: 'Page of Wands',
    normalImage: `${wandsPath}wands_page.png`,
    keywords: ['Enthusiasm', 'exploration', 'discovery', 'free spirit'],
    meaning:
      'Represents enthusiasm, exploration, and a free spirit. A messenger of new ideas and creative energy.',
    reverseMeaning:
      'Newly-formed ideas, redirecting energy, self-limiting beliefs, lack of direction.',
  },
  wands_knight: {
    name: 'Knight of Wands',
    normalImage: `${wandsPath}wands_knight.png`,
    keywords: ['Energy', 'passion', 'inspired action', 'adventure'],
    meaning:
      'Represents energy, passion, and impulsive action. He is adventurous and eager to pursue his goals.',
    reverseMeaning:
      'Passion project, haste, scattered energy, delays, frustration.',
  },
  wands_queen: {
    name: 'Queen of Wands',
    normalImage: `${wandsPath}wands_queen.png`,
    keywords: ['Courage', 'confidence', 'independence', 'social butterfly'],
    meaning:
      'Represents a courageous, confident, and determined person who is a social butterfly and a source of inspiration.',
    reverseMeaning:
      'Self-respect, self-confidence, introverted, a shrinking violet, aggressive.',
  },
  wands_king: {
    name: 'King of Wands',
    normalImage: `${wandsPath}wands_king.png`,
    keywords: ['Natural-born leader', 'vision', 'entrepreneur', 'honour'],
    meaning:
      'Represents a natural-born leader with a clear vision. He is charismatic, honorable, and inspires others to follow him.',
    reverseMeaning:
      'Impulsiveness, haste, ruthless, high expectations, tyrannical.',
  },
};
