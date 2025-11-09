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

// import all the tarot card images
import tarotFool from '@/assets/tarot/major_arcana/fool.png';
import tarotMagician from '@/assets/tarot/major_arcana/magician.png';
import tarotHighPriestess from '@/assets/tarot/major_arcana/priestess.png';
import tarotEmpress from '@/assets/tarot/major_arcana/empress.png';
import tarotEmperor from '@/assets/tarot/major_arcana/emperor.png';
import tarotHierophant from '@/assets/tarot/major_arcana/hierophant.png';
import tarotLovers from '@/assets/tarot/major_arcana/lovers.png';
import tarotChariot from '@/assets/tarot/major_arcana/chariot.png';
import tarotJustice from '@/assets/tarot/major_arcana/justice.png';
import tarotHermit from '@/assets/tarot/major_arcana/hermit.png';
import tarotWheelOfFortune from '@/assets/tarot/major_arcana/fortune.png';
import tarotStrength from '@/assets/tarot/major_arcana/strength.png';
import tarotHangedMan from '@/assets/tarot/major_arcana/hanged.png';
import tarotTemperance from '@/assets/tarot/major_arcana/temperance.png';
import tarotDevil from '@/assets/tarot/major_arcana/devil.png';
import tarotTower from '@/assets/tarot/major_arcana/tower.png';
import tarotSun from '@/assets/tarot/major_arcana/sun.png';
import tarotJudgement from '@/assets/tarot/major_arcana/judgement.png';
import tarotWorld from '@/assets/tarot/major_arcana/world.png';
import tarotDeath from '@/assets/tarot/major_arcana/death.png';
import tarotStar from '@/assets/tarot/major_arcana/star.png';
import tarotMoon from '@/assets/tarot/major_arcana/moon.png';

// add all other tarot imports here...
import tarotAceOfWands from '@/assets/tarot/wands/wands_ace.png';
import tarotTwoOfWands from '@/assets/tarot/wands/wands_2.png';
import tarotThreeOfWands from '@/assets/tarot/wands/wands_3.png';
import tarotFourOfWands from '@/assets/tarot/wands/wands_4.png';
import tarotFiveOfWands from '@/assets/tarot/wands/wands_5.png';
import tarotSixOfWands from '@/assets/tarot/wands/wands_6.png';
import tarotSevenOfWands from '@/assets/tarot/wands/wands_7.png';
import tarotEightOfWands from '@/assets/tarot/wands/wands_8.png';
import tarotNineOfWands from '@/assets/tarot/wands/wands_9.png';
import tarotTenOfWands from '@/assets/tarot/wands/wands_10.png';
import tarotPageOfWands from '@/assets/tarot/wands/wands_page.png';
import tarotKnightOfWands from '@/assets/tarot/wands/wands_knight.png';
import tarotQueebOfWands from '@/assets/tarot/wands/wands_queen.png';
import tarotKingOfWands from '@/assets/tarot/wands/wands_king.png';

import tarotAceOfCups from '@/assets/tarot/cups/cups_ace.png';
import tarotTwoOfCups from '@/assets/tarot/cups/cups_2.png';
import tarotThreeOfCups from '@/assets/tarot/cups/cups_3.png';
import tarotFourOfCups from '@/assets/tarot/cups/cups_4.png';
import tarotFiveOfCups from '@/assets/tarot/cups/cups_5.png';
import tarotSixOfCups from '@/assets/tarot/cups/cups_6.png';
import tarotSevenOfCups from '@/assets/tarot/cups/cups_7.png';
import tarotEightOfCups from '@/assets/tarot/cups/cups_8.png';
import tarotNineOfCups from '@/assets/tarot/cups/cups_9.png';
import tarotTenOfCups from '@/assets/tarot/cups/cups_10.png';
import tarotPageOfCups from '@/assets/tarot/cups/cups_page.png';
import tarotKnightOfCups from '@/assets/tarot/cups/cups_knight.png';
import tarotQueenOfCups from '@/assets/tarot/cups/cups_queen.png';
import tarotKingOfCups from '@/assets/tarot/cups/cups_king.png';

import tarotAceOfSwords from '@/assets/tarot/swords/swords_ace.png';
import tarotTwoOfSwords from '@/assets/tarot/swords/swords_2.png';
import tarotThreeOfSwords from '@/assets/tarot/swords/swords_3.png';
import tarotFourOfSwords from '@/assets/tarot/swords/swords_4.png';
import tarotFiveOfSwords from '@/assets/tarot/swords/swords_5.png';
import tarotSixOfSwords from '@/assets/tarot/swords/swords_6.png';
import tarotSevenOfSwords from '@/assets/tarot/swords/swords_7.png';
import tarotEightOfSwords from '@/assets/tarot/swords/swords_8.png';
import tarotNineOfSwords from '@/assets/tarot/swords/swords_9.png';
import tarotTenOfSwords from '@/assets/tarot/swords/swords_10.png';
import tarotPageOfSwords from '@/assets/tarot/swords/swords_page.png';
import tarotKnightOfSwords from '@/assets/tarot/swords/swords_knight.png';
import tarotQueenOfSwords from '@/assets/tarot/swords/swords_queen.png';
import tarotKingOfSwords from '@/assets/tarot/swords/swords_king.png';

import tarotAceOfPentacles from '@/assets/tarot/pentacles/pentacles_ace.png';
import tarotTwoOfPentacles from '@/assets/tarot/pentacles/pentacles_2.png';
import tarotThreeOfPentacles from '@/assets/tarot/pentacles/pentacles_3.png';
import tarotFourOfPentacles from '@/assets/tarot/pentacles/pentacles_4.png';
import tarotFiveOfPentacles from '@/assets/tarot/pentacles/pentacles_5.png';
import tarotSixOfPentacles from '@/assets/tarot/pentacles/pentacles_6.png';
import tarotSevenOfPentacles from '@/assets/tarot/pentacles/pentacles_7.png';
import tarotEightOfPentacles from '@/assets/tarot/pentacles/pentacles_8.png';
import tarotNineOfPentacles from '@/assets/tarot/pentacles/pentacles_9.png';
import tarotTenOfPentacles from '@/assets/tarot/pentacles/pentacles_10.png';
import tarotPageOfPentacles from '@/assets/tarot/pentacles/pentacles_page.png';
import tarotKnightOfPentacles from '@/assets/tarot/pentacles/pentacles_knight.png';
import tarotQueenOfPentacles from '@/assets/tarot/pentacles/pentacles_queen.png';
import tarotKingOfPentacles from '@/assets/tarot/pentacles/pentacles_king.png';

// Map card names to their images

const cardImages: Record<string, string> = {
  fool: tarotFool,
  magician: tarotMagician,
  priestess: tarotHighPriestess,
  empress: tarotEmpress,
  emperor: tarotEmperor,
  hierophant: tarotHierophant,
  lovers: tarotLovers,
  chariot: tarotChariot,
  justice: tarotJustice,
  hermit: tarotHermit,
  fortune: tarotWheelOfFortune,
  strength: tarotStrength,
  hanged: tarotHangedMan,
  temperance: tarotTemperance,
  devil: tarotDevil,
  tower: tarotTower,
  sun: tarotSun,
  judgement: tarotJudgement,
  world: tarotWorld,
  death: tarotDeath,
  star: tarotStar,
  moon: tarotMoon,

  // Add all other tarot images here
  wands_ace: tarotAceOfWands,
  wands_2: tarotTwoOfWands,
  wands_3: tarotThreeOfWands,
  wands_4: tarotFourOfWands,
  wands_5: tarotFiveOfWands,
  wands_6: tarotSixOfWands,
  wands_7: tarotSevenOfWands,
  wands_8: tarotEightOfWands,
  wands_9: tarotNineOfWands,
  wands_10: tarotTenOfWands,
  wands_page: tarotPageOfWands,
  wands_knight: tarotKnightOfWands,
  wands_queen: tarotQueebOfWands,
  wands_king: tarotKingOfWands,

  cups_ace: tarotAceOfCups,
  cups_2: tarotTwoOfCups,
  cups_3: tarotThreeOfCups,
  cups_4: tarotFourOfCups,
  cups_5: tarotFiveOfCups,
  cups_6: tarotSixOfCups,
  cups_7: tarotSevenOfCups,
  cups_8: tarotEightOfCups,
  cups_9: tarotNineOfCups,
  cups_10: tarotTenOfCups,
  cups_page: tarotPageOfCups,
  cups_knight: tarotKnightOfCups,
  cups_queen: tarotQueenOfCups,
  cups_king: tarotKingOfCups,

  swords_ace: tarotAceOfSwords,
  swords_2: tarotTwoOfSwords,
  swords_3: tarotThreeOfSwords,
  swords_4: tarotFourOfSwords,
  swords_5: tarotFiveOfSwords,
  swords_6: tarotSixOfSwords,
  swords_7: tarotSevenOfSwords,
  swords_8: tarotEightOfSwords,
  swords_9: tarotNineOfSwords,
  swords_10: tarotTenOfSwords,
  swords_page: tarotPageOfSwords,
  swords_knight: tarotKnightOfSwords,
  swords_queen: tarotQueenOfSwords,
  swords_king: tarotKingOfSwords,

  pentacles_ace: tarotAceOfPentacles,
  pentacles_2: tarotTwoOfPentacles,
  pentacles_3: tarotThreeOfPentacles,
  pentacles_4: tarotFourOfPentacles,
  pentacles_5: tarotFiveOfPentacles,
  pentacles_6: tarotSixOfPentacles,
  pentacles_7: tarotSevenOfPentacles,
  pentacles_8: tarotEightOfPentacles,
  pentacles_9: tarotNineOfPentacles,
  pentacles_10: tarotTenOfPentacles,
  pentacles_page: tarotPageOfPentacles,
  pentacles_knight: tarotKnightOfPentacles,
  pentacles_queen: tarotQueenOfPentacles,
  pentacles_king: tarotKingOfPentacles,
};

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
    large: 'w-32 h-56',
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="inline-block mx-1 cursor-pointer">
          <div
            className={`${sizeClasses[size]} relative transition-transform hover:scale-105`}
            title={`${card.name}${isReverse ? ' (Reverse)' : ''}`}
          >
            <img
              src={imageSrc}
              alt={card.name}
              className={`w-full h-full object-cover rounded-lg shadow-lg border border-border/20 ${
                isReverse ? 'transform rotate-180' : ''
              }`}
            />
          </div>
          <p className="text-xs text-center mt-1 text-muted-foreground">
            {card.name}
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <ScrollArea className="max-h-[80vh] p-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              {card.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <img
                src={imageSrc}
                alt={card.name}
                className="w-52 h-96 object-cover rounded-lg shadow-2xl border-4 border-border/20"
              />
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {card.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 border-b pb-2 text-primary">
                  正位解釋
                </h3>
                <DialogDescription className="text-base text-foreground/80">
                  {card.meaning}
                </DialogDescription>
              </div>
              {card.reverseMeaning && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 border-b pb-2 text-destructive">
                    逆位解釋
                  </h3>
                  <DialogDescription className="text-base text-foreground/80">
                    {card.reverseMeaning}
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