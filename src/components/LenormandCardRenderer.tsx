import React from 'react';
import { LENORMAND_CARDS } from '@/types/lenormand';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
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

import { lenormandImages } from '@/lib/cardImages';

// Map card names to their images (loaded from S3)
const cardImages: Record<string, string> = lenormandImages;

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
  const { t } = useTranslation();
  const cardKey = cardName.toLowerCase().replace(/ /g, '_');
  const card = LENORMAND_CARDS[cardKey];

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

  // Get translated card name
  const translatedName = t(`lenormandCards.${cardKey}.name`, {
    defaultValue: card.name,
  });

  // Get the actual image path from the imported images
  const cardImage = cardImages[cardKey] || card.normalImage;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span
          className={cn(
            'inline-block mx-1 text-center cursor-pointer align-top',
            className
          )}
        >
          <span
            className={`${sizeClasses[size]} relative transition-transform hover:scale-105 inline-block`}
            title={translatedName}
          >
            <img
              src={cardImage}
              alt={translatedName}
              className="w-full h-full object-cover rounded-lg shadow-lg border border-border/20"
            />
          </span>
          <span className="text-xs mt-1 text-muted-foreground block">
            {translatedName}
          </span>
        </span>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {translatedName}
          </DialogTitle>
          <DialogDescription>
            {t(`lenormandCards.${cardKey}.meaning`, {
              defaultValue: card.meaning,
            })}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={cardImage}
                alt={translatedName}
                className="w-48 h-72 object-cover rounded-lg shadow-xl border-2 border-border/30"
              />
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                {t('tarotCardRenderer.keywords', 'Keywords')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(
                  t(`lenormandCards.${cardKey}.keywords`, {
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

            <div>
              <h3 className="font-semibold text-lg mb-2">
                {t('tarotCardRenderer.meaning', 'Meaning')}
              </h3>
              <p className="text-muted-foreground">
                {t(`lenormandCards.${cardKey}.meaning`, {
                  defaultValue: card.meaning,
                })}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
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
