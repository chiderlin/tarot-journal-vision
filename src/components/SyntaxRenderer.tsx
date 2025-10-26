import React from 'react';
import { TarotCardRenderer } from './TarotCardRenderer';
import { LenormandCardRenderer } from './LenormandCardRenderer';

const tarotRegex = /#(\w+)(-reverse)?/g;
const lenormandRegex = /#lenormand-(\w+)/g;

interface ParsedPart {
  type: 'text' | 'tarot' | 'lenormand';
  content: string;
  isReverse?: boolean;
}

export const parseSyntax = (text: string): React.ReactNode[] => {
  const regex = /#(t|l)-([\w-]+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const typePrefix = match[1]; // 't' or 'l'
    let cardName = match[2];
    const isReverse = cardName.endsWith('-reverse');

    if (isReverse) {
      cardName = cardName.replace('-reverse', '');
    }

    if (typePrefix === 't') {
      parts.push(
        <TarotCardRenderer
          key={`${match.index}-${cardName}`}
          cardName={cardName}
          isReverse={isReverse}
          size="small"
        />
      );
    } else if (typePrefix === 'l') {
      parts.push(
        <LenormandCardRenderer
          key={`${match.index}-${cardName}`}
          cardName={cardName}
          size="small"
        />
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};
