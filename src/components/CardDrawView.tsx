import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shuffle, BookOpen, Wand2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TAROT_CARDS } from '@/types/tarot';
import { LENORMAND_CARDS } from '@/types/lenormand';
import { tarotImages, lenormandImages } from '@/lib/cardImages';

// ── Types ──────────────────────────────────────────────────────────────────
type DeckType = 'tarot' | 'lenormand' | 'mixed';

interface DrawnCard {
  key: string;
  type: 'tarot' | 'lenormand';
  isReverse: boolean;
}

// ── Fisher-Yates shuffle (in-place, unbiased) ──────────────────────────────
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function drawFromPool(keys: string[], count: number): string[] {
  return shuffle(keys).slice(0, Math.min(count, keys.length));
}

// ── Props ──────────────────────────────────────────────────────────────────
interface CardDrawViewProps {
  onDrawToJournal: (cardTokens: string[]) => void;
}

// ── Component ──────────────────────────────────────────────────────────────
export const CardDrawView: React.FC<CardDrawViewProps> = ({
  onDrawToJournal,
}) => {
  const { t } = useTranslation();

  const [deckType, setDeckType] = useState<DeckType>('tarot');
  // For single-deck modes
  const [cardCount, setCardCount] = useState(1);
  // For mixed mode: separate counts
  const [tarotCount, setTarotCount] = useState(1);
  const [lenormandCount, setLenormandCount] = useState(1);

  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // ── Draw logic ────────────────────────────────────────────────────────────
  const handleDraw = () => {
    setIsAnimating(true);
    setHasDrawn(false);

    setTimeout(() => {
      let result: DrawnCard[] = [];

      if (deckType === 'tarot') {
        const keys = Object.keys(TAROT_CARDS);
        drawFromPool(keys, cardCount).forEach((key) => {
          result.push({ key, type: 'tarot', isReverse: Math.random() < 0.5 });
        });
      } else if (deckType === 'lenormand') {
        const keys = Object.keys(LENORMAND_CARDS);
        drawFromPool(keys, cardCount).forEach((key) => {
          result.push({ key, type: 'lenormand', isReverse: false });
        });
      } else {
        // mixed: tarot first, then lenormand
        const tKeys = Object.keys(TAROT_CARDS);
        drawFromPool(tKeys, tarotCount).forEach((key) => {
          result.push({ key, type: 'tarot', isReverse: Math.random() < 0.5 });
        });
        const lKeys = Object.keys(LENORMAND_CARDS);
        drawFromPool(lKeys, lenormandCount).forEach((key) => {
          result.push({ key, type: 'lenormand', isReverse: false });
        });
      }

      setDrawnCards(result);
      setIsAnimating(false);
      setHasDrawn(true);
    }, 600);
  };

  // ── Convert drawn cards → journal token format ────────────────────────────
  const toJournalTokens = (cards: DrawnCard[]): string[] =>
    cards.map((c) => {
      const prefix = c.type === 'tarot' ? 't' : 'l';
      const suffix = c.type === 'tarot' && c.isReverse ? '-reverse' : '';
      return `${prefix}-${c.key}${suffix}`;
    });

  // ── Count selectors component ─────────────────────────────────────────────
  const CountSelector = ({
    value,
    onChange,
    label,
  }: {
    value: number;
    onChange: (n: number) => void;
    label?: string;
  }) => (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <span className="text-xs text-muted-foreground font-medium">
          {label}
        </span>
      )}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all border-2 ${
              value === n
                ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105'
                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-600'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );

  // ── Card display ───────────────────────────────────────────────────────────
  const DrawnCardDisplay = ({
    card,
    index,
  }: {
    card: DrawnCard;
    index: number;
  }) => {
    const isTarot = card.type === 'tarot';
    const imageSrc = isTarot
      ? tarotImages[card.key]
      : lenormandImages[card.key];
    const cardData = isTarot
      ? TAROT_CARDS[card.key]
      : LENORMAND_CARDS[card.key];

    const translatedName = isTarot
      ? t(`tarotCards.${card.key}.name`, {
          defaultValue: cardData?.name ?? card.key,
        })
      : t(`lenormandCards.${card.key}.name`, {
          defaultValue: cardData?.name ?? card.key,
        });

    const keywords = isTarot
      ? (t(`tarotCards.${card.key}.keywords`, {
          defaultValue:
            (cardData as (typeof TAROT_CARDS)[string])?.keywords ?? [],
          returnObjects: true,
        }) as string[])
      : (t(`lenormandCards.${card.key}.keywords`, {
          defaultValue:
            (cardData as (typeof LENORMAND_CARDS)[string])?.keywords ?? [],
          returnObjects: true,
        }) as string[]);

    const meaning = isTarot
      ? card.isReverse
        ? t(`tarotCards.${card.key}.reverseMeaning`, {
            defaultValue:
              (cardData as (typeof TAROT_CARDS)[string])?.reverseMeaning ?? '',
          })
        : t(`tarotCards.${card.key}.meaning`, {
            defaultValue: cardData?.meaning ?? '',
          })
      : t(`lenormandCards.${card.key}.meaning`, {
          defaultValue: cardData?.meaning ?? '',
        });

    return (
      <div
        className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4"
        style={{
          animationDelay: `${index * 80}ms`,
          animationFillMode: 'backwards',
        }}
      >
        <div className="relative group">
          {/* deck type badge */}
          <span
            className={`absolute -top-2 -right-2 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow ${
              isTarot
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                : 'bg-amber-100 text-amber-700 border border-amber-300'
            }`}
          >
            {isTarot
              ? t('cardDraw.badge.tarot', '塔羅')
              : t('cardDraw.badge.lenormand', '雷諾曼')}
          </span>

          {/* card image */}
          <div className="relative overflow-hidden rounded-xl shadow-lg border-2 border-purple-200/60 group-hover:border-purple-400/80 transition-all duration-200">
            <img
              src={imageSrc}
              alt={translatedName}
              className={`w-28 h-48 object-cover transition-transform duration-300 group-hover:scale-105 ${
                card.isReverse ? 'rotate-180' : ''
              }`}
            />
            {card.isReverse && isTarot && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                {t('tarotCardRenderer.reversed', '逆位')}
              </div>
            )}
          </div>
        </div>

        {/* card info */}
        <div className="text-center max-w-[120px]">
          <p className="font-semibold text-sm text-gray-800 leading-tight">
            {translatedName}
          </p>
          <div className="flex flex-wrap gap-1 justify-center mt-1">
            {keywords.slice(0, 2).map((kw, i) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
              >
                {kw}
              </Badge>
            ))}
          </div>
        </div>

        {/* meaning */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-[148px] line-clamp-3">
          {meaning}
        </p>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-2">
          <Shuffle className="w-4 h-4" />
          {t('cardDraw.title', '神秘抽牌')}
        </div>
        <p className="text-muted-foreground text-sm">
          {t('cardDraw.subtitle', '讓宇宙引導你，抽出今天的訊息')}
        </p>
      </div>

      {/* Settings card */}
      <Card className="border-purple-100 shadow-sm">
        <CardContent className="pt-6 space-y-6">
          {/* Deck type selector */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700 text-center">
              {t('cardDraw.deckTypeLabel', '選擇牌組')}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                {
                  key: 'tarot' as DeckType,
                  icon: Wand2,
                  label: t('cardDraw.deckType.tarot', '塔羅牌'),
                },
                {
                  key: 'lenormand' as DeckType,
                  icon: BookOpen,
                  label: t('cardDraw.deckType.lenormand', '雷諾曼'),
                },
                {
                  key: 'mixed' as DeckType,
                  icon: Layers,
                  label: t('cardDraw.deckType.mixed', '混合牌'),
                },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setDeckType(key);
                    setHasDrawn(false);
                    setDrawnCards([]);
                  }}
                  className={`flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    deckType === key
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Count selectors */}
          <div className="flex flex-col items-center gap-4">
            {deckType !== 'mixed' ? (
              <div className="space-y-2 text-center">
                <p className="text-sm font-semibold text-gray-700">
                  {t('cardDraw.cardCountLabel', '抽幾張？')}
                </p>
                <CountSelector value={cardCount} onChange={setCardCount} />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 justify-center items-center">
                <div className="space-y-2 text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    {t('cardDraw.tarotCountLabel', '塔羅張數')}
                  </p>
                  <CountSelector value={tarotCount} onChange={setTarotCount} />
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    {t('cardDraw.lenormandCountLabel', '雷諾曼張數')}
                  </p>
                  <CountSelector
                    value={lenormandCount}
                    onChange={setLenormandCount}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Draw button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleDraw}
              disabled={isAnimating}
              className="px-10 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-200 transition-all duration-200"
            >
              <Shuffle
                className={`w-5 h-5 mr-2 ${isAnimating ? 'animate-spin' : ''}`}
              />
              {isAnimating
                ? t('cardDraw.drawing', '抽牌中...')
                : t('cardDraw.drawButton', '開始抽牌')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {hasDrawn && drawnCards.length > 0 && (
        <div className="space-y-6">
          {/* Section header */}
          {deckType === 'mixed' && (
            <div className="space-y-2">
              {/* Tarot section label */}
              {drawnCards.some((c) => c.type === 'tarot') && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-px flex-1 bg-indigo-200" />
                  <span className="text-xs font-semibold text-indigo-500 px-2">
                    {t('cardDraw.deckType.tarot', '塔羅牌')}
                  </span>
                  <span className="h-px flex-1 bg-indigo-200" />
                </div>
              )}
            </div>
          )}

          {/* Cards grid */}
          <div className="flex flex-wrap justify-center gap-6">
            {/* Tarot cards */}
            {drawnCards
              .filter((c) => c.type === 'tarot')
              .map((card, i) => (
                <DrawnCardDisplay
                  key={`t-${card.key}-${i}`}
                  card={card}
                  index={i}
                />
              ))}
          </div>

          {/* Lenormand section divider (mixed mode) */}
          {deckType === 'mixed' &&
            drawnCards.some((c) => c.type === 'lenormand') && (
              <div className="flex items-center gap-2 my-2">
                <span className="h-px flex-1 bg-amber-200" />
                <span className="text-xs font-semibold text-amber-500 px-2">
                  {t('cardDraw.deckType.lenormand', '雷諾曼卡')}
                </span>
                <span className="h-px flex-1 bg-amber-200" />
              </div>
            )}

          {/* Lenormand cards */}
          <div className="flex flex-wrap justify-center gap-6">
            {drawnCards
              .filter((c) => c.type === 'lenormand')
              .map((card, i) => (
                <DrawnCardDisplay
                  key={`l-${card.key}-${i}`}
                  card={card}
                  index={i}
                />
              ))}
          </div>

          {/* Write to journal button */}
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => onDrawToJournal(toJournalTokens(drawnCards))}
              className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-500 transition-all"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {t('cardDraw.writeToJournal', '將此次抽牌寫入日記')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
