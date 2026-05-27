import React from 'react';
import { TAROT_CARDS } from '@/types/tarot';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from 'react-i18next';
import { tarotImages as tarotImagesS3 } from '@/lib/cardImages';

// Map card names to their images (loaded from S3)
const cardImages: Record<string, string> = tarotImagesS3;

interface TarotCardRendererProps {
  cardName: string;
  isReverse?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const TarotCardRenderer: React.FC<TarotCardRendererProps> = ({
  cardName,
  isReverse = false,
  size = 'small',
}) => {
  const { t } = useTranslation();
  const cardKey = cardName.toLowerCase();
  const card = TAROT_CARDS[cardKey];
  const imageSrc = cardImages[cardKey];

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
    large: 'w-32 h-56',
  };

  // Get translated card name
  const translatedName = t(`tarotCards.${cardKey}.name`, {
    defaultValue: card.name,
  });

  // Get upright/reversed label
  const uprightLabel = t('tarotCardRenderer.upright', 'Upright');
  const reversedLabel = t('tarotCardRenderer.reversed', 'Reversed');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="inline-block mx-1 cursor-pointer align-top">
          <span
            className={`${sizeClasses[size]} relative transition-transform hover:scale-105 inline-block`}
            title={`${translatedName}${isReverse ? ` (${reversedLabel})` : ''}`}
          >
            <img
              src={imageSrc}
              alt={translatedName}
              className={`w-full h-full object-cover rounded-lg shadow-lg border border-border/20 ${
                isReverse ? 'transform rotate-180' : ''
              }`}
            />
          </span>
          <span className="text-xs text-center mt-1 text-muted-foreground block">
            {translatedName}
          </span>
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <ScrollArea className="max-h-[80vh] p-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              {translatedName}
            </DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <img
                src={imageSrc}
                alt={translatedName}
                className="w-52 h-96 object-cover rounded-lg shadow-2xl border-4 border-border/20"
              />
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {(
                  t(`tarotCards.${cardKey}.keywords`, {
                    defaultValue: card.keywords,
                    returnObjects: true,
                  }) as string[]
                ).map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 border-b pb-2 text-primary">
                  {uprightLabel}
                </h3>
                <DialogDescription className="text-base text-foreground/80">
                  {t(`tarotCards.${cardKey}.meaning`, {
                    defaultValue: card.meaning,
                  })}
                </DialogDescription>
              </div>
              {card.reverseMeaning && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 border-b pb-2 text-destructive">
                    {reversedLabel}
                  </h3>
                  <DialogDescription className="text-base text-foreground/80">
                    {t(`tarotCards.${cardKey}.reverseMeaning`, {
                      defaultValue: card.reverseMeaning,
                    })}
                  </DialogDescription>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
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
