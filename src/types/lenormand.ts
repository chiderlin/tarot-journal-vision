export interface LenormandCard {
  name: string;
  normalImage: string;
  keywords: string[];
  meaning: string;
}

const lenormandPath = '/src/assets/lenormand/';

export const LENORMAND_CARDS: Record<string, LenormandCard> = {
  rider: {
    name: 'Rider',
    normalImage: `${lenormandPath}1-rider.png`,
    keywords: ['News', 'messages', 'speed', 'activity'],
    meaning: 'Represents news, messages, and the arrival of something or someone new. It signifies speed and activity.',
  },
  clover: {
    name: 'Clover',
    normalImage: `${lenormandPath}2-clover.png`,
    keywords: ['Luck', 'small opportunities', 'happiness', 'brief moments'],
    meaning: 'Represents a small stroke of luck, a pleasant surprise, or a brief moment of happiness. It encourages taking a small risk.',
  },
  ship: {
    name: 'Ship',
    normalImage: `${lenormandPath}3-ship.png`,
    keywords: ['Travel', 'distance', 'transitions', 'commerce'],
    meaning: 'Represents travel, distance, transitions, and commerce. It can signify a physical journey or a metaphorical one.',
  },
  house: {
    name: 'House',
    normalImage: `${lenormandPath}4-house.png`,
    keywords: ['Home', 'family', 'stability', 'security'],
    meaning: 'Represents home, family, stability, and security. It is the foundation and core of your life.',
  },
  tree: {
    name: 'Tree',
    normalImage: `${lenormandPath}5-tree.png`,
    keywords: ['Health', 'growth', 'patience', 'ancestry'],
    meaning: 'Represents health, slow growth, and deep-rooted connections. It advises patience and looking at long-term development.',
  },
  cloud: {
    name: 'Cloud',
    normalImage: `${lenormandPath}6-cloud.png`,
    keywords: ['Confusion', 'uncertainty', 'doubt', 'problems'],
    meaning: 'Represents confusion, uncertainty, and temporary problems. The situation will clear up soon.',
  },
  snake: {
    name: 'Snake',
    normalImage: `${lenormandPath}7-snake.png`,
    keywords: ['Deception', 'betrayal', 'complications', 'desire'],
    meaning: 'Represents deception, complications, and potential betrayal. It advises caution and awareness of your surroundings.',
  },
  coffin: {
    name: 'Coffin',
    normalImage: `${lenormandPath}8-coffin.png`,
    keywords: ['Endings', 'illness', 'transformation', 'loss'],
    meaning: 'Represents endings, illness, and transformation. It signifies the necessary conclusion of a matter to make way for the new.',
  },
  bouquet: {
    name: 'Bouquet',
    normalImage: `${lenormandPath}9-bouquet.png`,
    keywords: ['Gift', 'beauty', 'appreciation', 'invitation'],
    meaning: 'Represents a gift, beauty, appreciation, and social invitations. A pleasant surprise or a gesture of kindness.',
  },
  scythe: {
    name: 'Scythe',
    normalImage: `${lenormandPath}10-scythe.png`,
    keywords: ['Sudden decision', 'danger', 'cutting away', 'harvest'],
    meaning: 'Represents a sudden, swift decision or action. It can mean danger, but also the need to cut something away quickly.',
  },
  whip: {
    name: 'Whip',
    normalImage: `${lenormandPath}11-whip.png`,
    keywords: ['Conflict', 'arguments', 'repetition', 'passion'],
    meaning: 'Represents conflict, debates, and repetitive actions. It can also signify passion and physical activity.',
  },
  birds: {
    name: 'Birds',
    normalImage: `${lenormandPath}12-birds.png`,
    keywords: ['Communication', 'gossip', 'excitement', 'chatter'],
    meaning: 'Represents verbal communication, gossip, and excitement. A lot of chatter, phone calls, or messages.',
  },
  child: {
    name: 'Child',
    normalImage: `${lenormandPath}13-child.png`,
    keywords: ['New beginning', 'smallness', 'innocence', 'playfulness'],
    meaning: 'Represents a new start, something small, or an actual child. It carries an energy of innocence and playfulness.',
  },
  fox: {
    name: 'Fox',
    normalImage: `${lenormandPath}14-fox.png`,
    keywords: ['Cunning', 'job', 'suspicion', 'strategy'],
    meaning: 'Represents the job or work, but also cunning, suspicion, and the need for strategy. Advises to be clever and cautious.',
  },
  bear: {
    name: 'Bear',
    normalImage: `${lenormandPath}15-bear.png`,
    keywords: ['Power', 'strength', 'finances', 'authority'],
    meaning: 'Represents personal power, strength, and authority. It is often linked to finances, diet, and leadership.',
  },
  star: {
    name: 'Star',
    normalImage: `${lenormandPath}16-star.png`,
    keywords: ['Hope', 'inspiration', 'guidance', 'dreams'],
    meaning: 'Represents hope, inspiration, and guidance. It suggests following your dreams and having faith in the future.',
  },
  stork: {
    name: 'Stork',
    normalImage: `${lenormandPath}17-stork.png`,
    keywords: ['Change', 'movement', 'relocation', 'improvement'],
    meaning: 'Represents change, movement, and improvement. It often signifies relocation, a change in perspective, or the arrival of something new.',
  },
  dog: {
    name: 'Dog',
    normalImage: `${lenormandPath}18-dog.png`,
    keywords: ['Friendship', 'loyalty', 'trust', 'support'],
    meaning: 'Represents a loyal friend, trust, and support. It signifies a reliable and faithful connection with someone.',
  },
  tower: {
    name: 'Tower',
    normalImage: `${lenormandPath}19-tower.png`,
    keywords: ['Authority', 'government', 'isolation', 'structure'],
    meaning: 'Represents authority, corporations, and official structures. It can also signify isolation or a need for boundaries.',
  },
  garden: {
    name: 'Garden',
    normalImage: `${lenormandPath}20-garden.png`,
    keywords: ['Public', 'society', 'events', 'socializing'],
    meaning: 'Represents public spaces, social events, and your network. It is about being out in society and meeting people.',
  },
  mountain: {
    name: 'Mountain',
    normalImage: `${lenormandPath}21-mountain.png`,
    keywords: ['Obstacles', 'delays', 'challenges', 'blockages'],
    meaning: 'Represents a significant obstacle, delays, and challenges. It requires patience and perseverance to overcome.',
  },
  crossroads: {
    name: 'Crossroads',
    normalImage: `${lenormandPath}22-crossroads.png`,
    keywords: ['Choices', 'decisions', 'alternatives', 'paths'],
    meaning: 'Represents a point of decision. There are multiple paths available, and a choice must be made.',
  },
  mice: {
    name: 'Mice',
    normalImage: `${lenormandPath}23-mice.png`,
    keywords: ['Theft', 'loss', 'anxiety', 'decay'],
    meaning: 'Represents gradual loss, theft, or decay. It brings anxiety and suggests something is being nibbled away.',
  },
  heart: {
    name: 'Heart',
    normalImage: `${lenormandPath}24-heart.png`,
    keywords: ['Love', 'passion', 'romance', 'charity'],
    meaning: 'Represents love, passion, and all matters of the heart. It signifies deep affection and romantic feelings.',
  },
  ring: {
    name: 'Ring',
    normalImage: `${lenormandPath}25-ring.png`,
    keywords: ['Commitment', 'contract', 'partnership', 'cycle'],
    meaning: 'Represents commitment, contracts, and partnerships. It can signify marriage, a business agreement, or a cycle.',
  },
  book: {
    name: 'Book',
    normalImage: `${lenormandPath}26-book.png`,
    keywords: ['Secrets', 'knowledge', 'education', 'projects'],
    meaning: 'Represents secrets, knowledge, and education. Something is hidden or yet to be revealed. It can also point to a project or studies.',
  },
  letter: {
    name: 'Letter',
    normalImage: `${lenormandPath}27-letter.png`,
    keywords: ['Documents', 'information', 'email', 'written communication'],
    meaning: 'Represents written communication, such as documents, emails, or test results. It is about information being shared.',
  },
  gentleman: {
    name: 'Gentleman',
    normalImage: `${lenormandPath}28-gentleman.png`,
    keywords: ['Male querent', 'partner', 'significant man'],
    meaning: 'Represents the male querent or a significant man in the querent\'s life (partner, father, brother).',
  },
  lady: {
    name: 'Lady',
    normalImage: `${lenormandPath}29-lady.png`,
    keywords: ['Female querent', 'partner', 'significant woman'],
    meaning: 'Represents the female querent or a significant woman in the querent\'s life (partner, mother, sister).',
  },
  lily: {
    name: 'Lily',
    normalImage: `${lenormandPath}30-lily.png`,
    keywords: ['Peace', 'maturity', 'sensuality', 'family elder'],
    meaning: 'Represents peace, maturity, and sensuality. It can also signify an older family member or a period of calm.',
  },
  sun: {
    name: 'Sun',
    normalImage: `${lenormandPath}31-sun.png`,
    keywords: ['Success', 'vitality', 'energy', 'optimism'],
    meaning: 'Represents success, vitality, and great energy. It is a card of optimism and achieving your goals.',
  },
  moon: {
    name: 'Moon',
    normalImage: `${lenormandPath}32-moon.png`,
    keywords: ['Emotions', 'intuition', 'recognition', 'creativity'],
    meaning: 'Represents emotions, intuition, and public recognition. It is linked to creativity and psychic abilities.',
  },
  key: {
    name: 'Key',
    normalImage: `${lenormandPath}33-key.png`,
    keywords: ['Solution', 'answers', 'success', 'destiny'],
    meaning: 'Represents the solution to a problem. It signifies that you have the answer and success is certain.',
  },
  fish: {
    name: 'Fish',
    normalImage: `${lenormandPath}34-fish.png`,
    keywords: ['Finances', 'business', 'abundance', 'flow'],
    meaning: 'Represents finances, business, and abundance. It signifies a flow of money or resources.',
  },
  anchor: {
    name: 'Anchor',
    normalImage: `${lenormandPath}35-anchor.png`,
    keywords: ['Stability', 'security', 'long-term', 'work'],
    meaning: 'Represents stability, security, and long-term commitment. It can signify reaching a safe harbor or a long-term job.',
  },
  cross: {
    name: 'Cross',
    normalImage: `${lenormandPath}36-cross.png`,
    keywords: ['Burdens', 'suffering', 'destiny', 'faith'],
    meaning: 'Represents burdens, suffering, and challenges that feel destined. It is a call to have faith.',
  },
};
