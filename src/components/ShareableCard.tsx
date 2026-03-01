import React from 'react';
import { JournalEntry } from '@/types/tarot';
import { TarotCardRenderer } from './TarotCardRenderer';
import { LenormandCardRenderer } from './LenormandCardRenderer';

interface ShareableCardProps {
  entry: JournalEntry;
}

export const ShareableCard = React.forwardRef<
  HTMLDivElement,
  ShareableCardProps
>(({ entry }, ref) => {
  return (
    <div
      ref={ref}
      className="w-[800px] h-[1000px] bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-16 flex items-center justify-center relative overflow-hidden"
      style={{ fontFamily: 'serif' }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-purple-400 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-400 blur-3xl" />
      </div>

      {/* Card display area */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* Tarot Cards */}
        {entry.cards && entry.cards.length > 0 && (
          <div className="flex gap-12 justify-center items-center">
            {entry.cards
              .filter((tag) => tag.startsWith('t-') || tag.startsWith('l-'))
              .slice(0, 3)
              .map((cardTag, index) => {
                const isTarot = cardTag.startsWith('t-');
                const isLenormand = cardTag.startsWith('l-');
                const isReverse = cardTag.includes('-reverse');

                const cleanCardName = cardTag
                  .replace('t-', '')
                  .replace('l-', '')
                  .replace('-reverse', '')
                  .trim();

                return (
                  <div
                    key={index}
                    className="transform transition-all hover:scale-105"
                    style={{
                      transform: `rotate(${(index - 1) * 3}deg)`,
                    }}
                  >
                    <div className="p-4 bg-white rounded-xl shadow-2xl border-2 border-purple-100">
                      {isTarot ? (
                        <TarotCardRenderer
                          cardName={cleanCardName}
                          isReverse={isReverse}
                          size="large"
                        />
                      ) : (
                        <LenormandCardRenderer
                          cardName={cleanCardName}
                          size="large"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Minimal branding at bottom */}
        <div className="absolute bottom-8 right-8 opacity-30">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-black">
            Tarot Journal Vision
          </p>
        </div>
      </div>
    </div>
  );
});

ShareableCard.displayName = 'ShareableCard';
