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

// Import all lenormand card images
import lenormandRider from '@/assets/lenormand/1-rider.png';
import lenormandClover from '@/assets/lenormand/2-clover.png';
import lenormandShip from '@/assets/lenormand/3-ship.png';
import lenormandHouse from '@/assets/lenormand/4-house.png';
import lenormandTree from '@/assets/lenormand/5-tree.png';
import lenormandCloud from '@/assets/lenormand/6-cloud.png';
import lenormandSnake from '@/assets/lenormand/7-snake.png';
import lenormandCoffin from '@/assets/lenormand/8-coffin.png';
import lenormandBouquet from '@/assets/lenormand/9-bouquet.png';
import lenormandScythe from '@/assets/lenormand/10-scythe.png';
import lenormandWhip from '@/assets/lenormand/11-whip.png';
import lenormandBirds from '@/assets/lenormand/12-birds.png';
import lenormandChild from '@/assets/lenormand/13-child.png';
import lenormandFox from '@/assets/lenormand/14-fox.png';
import lenormandBear from '@/assets/lenormand/15-bear.png';
import lenormandStar from '@/assets/lenormand/16-star.png';
import lenormandStork from '@/assets/lenormand/17-stork.png';
import lenormandDog from '@/assets/lenormand/18-dog.png';
import lenormandTower from '@/assets/lenormand/19-tower.png';
import lenormandGarden from '@/assets/lenormand/20-garden.png';
import lenormandMountain from '@/assets/lenormand/21-mountain.png';
import lenormandCrossroads from '@/assets/lenormand/22-crossroads.png';
import lenormandMice from '@/assets/lenormand/23-mice.png';
import lenormandHeart from '@/assets/lenormand/24-heart.png';
import lenormandRing from '@/assets/lenormand/25-ring.png';
import lenormandBook from '@/assets/lenormand/26-book.png';
import lenormandLetter from '@/assets/lenormand/27-letter.png';
import lenormandGentleman from '@/assets/lenormand/28-gentleman.png';
import lenormandLady from '@/assets/lenormand/29-lady.png';
import lenormandLily from '@/assets/lenormand/30-lily.png';
import lenormandSun from '@/assets/lenormand/31-sun.png';
import lenormandMoon from '@/assets/lenormand/32-moon.png';
import lenormandKey from '@/assets/lenormand/33-key.png';
import lenormandFish from '@/assets/lenormand/34-fish.png';
import lenormandAnchor from '@/assets/lenormand/35-anchor.png';
import lenormandCross from '@/assets/lenormand/36-cross.png';

// Map card names to their images
const cardImages: Record<string, string> = {
  rider: lenormandRider,
  clover: lenormandClover,
  ship: lenormandShip,
  house: lenormandHouse,
  tree: lenormandTree,
  cloud: lenormandCloud,
  snake: lenormandSnake,
  coffin: lenormandCoffin,
  bouquet: lenormandBouquet,
  scythe: lenormandScythe,
  whip: lenormandWhip,
  birds: lenormandBirds,
  child: lenormandChild,
  fox: lenormandFox,
  bear: lenormandBear,
  star: lenormandStar,
  stork: lenormandStork,
  dog: lenormandDog,
  tower: lenormandTower,
  garden: lenormandGarden,
  mountain: lenormandMountain,
  crossroads: lenormandCrossroads,
  mice: lenormandMice,
  heart: lenormandHeart,
  ring: lenormandRing,
  book: lenormandBook,
  letter: lenormandLetter,
  gentleman: lenormandGentleman,
  lady: lenormandLady,
  lily: lenormandLily,
  sun: lenormandSun,
  moon: lenormandMoon,
  key: lenormandKey,
  fish: lenormandFish,
  anchor: lenormandAnchor,
  cross: lenormandCross,
};

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
        <div
          className={cn(
            'inline-block mx-1 text-center cursor-pointer',
            className
          )}
        >
          <div
            className={`${sizeClasses[size]} relative transition-transform hover:scale-105`}
            title={translatedName}
          >
            <img
              src={cardImage}
              alt={translatedName}
              className="w-full h-full object-cover rounded-lg shadow-lg border border-border/20"
            />
          </div>
          <p className="text-xs mt-1 text-muted-foreground">{translatedName}</p>
        </div>
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
