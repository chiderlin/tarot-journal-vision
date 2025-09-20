import React from 'react';
import { TAROT_CARDS } from '@/types/tarot';
import tarotFool from '@/assets/tarot-fool.jpg';
import tarotMagician from '@/assets/tarot-magician.jpg';
import tarotDeath from '@/assets/tarot-death.jpg';
import tarotStar from '@/assets/tarot-star.jpg';

const cardImages: Record<string, string> = {
  fool: tarotFool,
  magician: tarotMagician,
  death: tarotDeath,
  star: tarotStar,
};

interface TarotCardRendererProps {
  cardName: string;
  isReverse?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const TarotCardRenderer: React.FC<TarotCardRendererProps> = ({ 
  cardName, 
  isReverse = false,
  size = 'small'
}) => {
  const card = TAROT_CARDS[cardName.toLowerCase()];
  const imageSrc = cardImages[cardName.toLowerCase()];
  
  if (!card || !imageSrc) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-muted-foreground text-xs">
        #{cardName} (unknown card)
      </span>
    );
  }

  const sizeClasses = {
    small: 'w-16 h-28',
    medium: 'w-24 h-42',
    large: 'w-32 h-56'
  };

  return (
    <div className="inline-block mx-1">
      <div 
        className={`${sizeClasses[size]} relative transition-transform hover:scale-105 cursor-pointer`}
        title={`${card.name}${isReverse ? ' (Reverse)' : ''}`}
      >
        <img
          src={imageSrc}
          alt={card.name}
          className={`w-full h-full object-cover rounded-lg shadow-lg border border-border/20 ${
            isReverse ? 'transform rotate-180' : ''
          }`}
        />
        {isReverse && (
          <div className="absolute top-1 left-1 bg-destructive text-destructive-foreground text-xs px-1 rounded">
            逆位
          </div>
        )}
      </div>
      <p className="text-xs text-center mt-1 text-muted-foreground">
        {card.name}
      </p>
    </div>
  );
};

// Helper function to parse tarot card syntax from text
export const parseTarotSyntax = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  const regex = /#(\w+)(-reverse)?/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const cardName = match[1];
    const isReverse = !!match[2];
    
    parts.push(
      <TarotCardRenderer
        key={`${match.index}-${cardName}`}
        cardName={cardName}
        isReverse={isReverse}
        size="small"
      />
    );

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};