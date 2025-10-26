import React from 'react';
import { LENORMAND_CARDS } from '@/types/lenormand';
import { cn } from '@/lib/utils';

interface LenormandCardRendererProps {
  cardName: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const LenormandCardRenderer: React.FC<LenormandCardRendererProps> = ({
  cardName,
  size = 'small',
  className,
}) => {
  const cardKey = cardName.toLowerCase().replace(/ /g, '_');
  const card = LENORMAND_CARDS[cardKey];

  console.log('cardName', cardName);
  console.log('cardKey', cardKey);
  console.log('card', card);
  if (!card) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-muted-foreground text-xs">
        #{cardName} (unknown card)
      </span>
    );
  }

  const sizeClasses = {
    small: 'w-16 h-24',
    medium: 'w-24 h-36',
    large: 'w-32 h-48',
  };

  return (
    <div className={cn('inline-block mx-1 text-center', className)}>
      <div
        className={`${sizeClasses[size]} relative transition-transform hover:scale-105 cursor-pointer`}
        title={card.name}
      >
        <img
          src={card.normalImage}
          alt={card.name}
          className="w-full h-full object-cover rounded-lg shadow-lg border border-border/20"
        />
      </div>
      <p className="text-xs mt-1 text-muted-foreground">{card.name}</p>
    </div>
  );
};

// Helper function to parse lenormand card syntax from text
export const parseLenormandSyntax = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  const regex = /#lenormand-(\w+)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const cardName = match[1];

    parts.push(
      <LenormandCardRenderer
        key={`${match.index}-${cardName}`}
        cardName={cardName}
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
