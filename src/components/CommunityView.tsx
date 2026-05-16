import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JournalEntry, DEFAULT_CATEGORIES, TAROT_CARDS } from '@/types/tarot';
import { LENORMAND_CARDS } from '@/types/lenormand';
import { EMOTIONS, EmotionKey } from '@/types/emotions';
import { 
  Calendar, Globe, Sparkles, AlertCircle, Smile, Frown, Flower2, HelpCircle, Heart, Zap, Minus, Briefcase, Users, Sunrise, FileText, ChevronUp, ChevronDown
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MarkdownRenderer } from './MarkdownRenderer';
import { TarotCardRenderer } from './TarotCardRenderer';
import { LenormandCardRenderer } from './LenormandCardRenderer';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, LucideIcon> = {
  Smile, Frown, AlertCircle, Flower2, HelpCircle, Heart, Zap, Minus, Briefcase, Users, Sparkles, Sunrise, FileText
};

const renderIcon = (iconName: string, className: string = 'w-4 h-4') => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent className={className} /> : null;
};

export const CommunityView = () => {
  const { t } = useTranslation();
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const { data: entries = [], isLoading, error } = useQuery({
    queryKey: ['public-journal-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map((item) => ({
        ...item,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })) as JournalEntry[];
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryInfo = (categoryName: string) => {
    return (
      DEFAULT_CATEGORIES.find((cat) => cat.name === categoryName) || {
        name: categoryName,
        color: 'hsl(var(--muted))',
        icon: 'FileText',
      }
    );
  };

  const toggleExpand = (entryId: string) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) newSet.delete(entryId);
      else newSet.add(entryId);
      return newSet;
    });
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading community posts...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Failed to load community posts.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h2 className="text-3xl font-bold text-gray-700 mb-2 flex items-center justify-center gap-2">
          <Globe className="w-8 h-8 text-indigo-500" />
          {t('community.title', '社群分享')}
        </h2>
        <p className="text-muted-foreground">{t('community.subtitle', '探索其他人分享的占卜經驗與洞察')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {t('community.noPosts', '目前還沒有公開的分享。')}
              </p>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => {
            const categoryInfo = getCategoryInfo(entry.category);
            const isExpanded = expandedEntries.has(entry.id);
            const showExpandButton = entry.content.split('\n').length > 3 || entry.content.length > 150;

            return (
              <Card
                key={entry.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col bg-white/50 backdrop-blur-sm border-indigo-100"
              >
                <div className="h-40 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 relative overflow-hidden flex items-center justify-center p-4">
                  <div className="flex -space-x-8 hover:space-x-2 transition-all duration-500">
                    {entry.cards && entry.cards.length > 0 ? (
                      entry.cards.slice(0, 3).map((card, idx) => {
                        const cleanName = card.replace(/^t-/, '').replace(/^l-/, '').replace(/-reverse$/, '');
                        const isReverse = card.endsWith('-reverse');
                        const isLenormand = card.startsWith('l-');
                        
                        return (
                          <div key={idx} className="transform hover:-translate-y-4 hover:scale-110 transition-all duration-300 shadow-lg rounded-lg overflow-hidden">
                            {isLenormand ? (
                              <LenormandCardRenderer cardName={cleanName} size="small" />
                            ) : (
                              <TarotCardRenderer cardName={cleanName} isReverse={isReverse} size="small" />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center text-indigo-300 gap-2">
                        <Sparkles className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                  </div>
                  
                  {/* Post Type Badge */}
                  {entry.post_type && (
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge variant="secondary" className="bg-white/80 backdrop-blur-md text-indigo-600">
                        {t(`community.postType.${entry.post_type}`, entry.post_type)}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader className="p-4 pb-0">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                      {entry.title || t('journalEditor.untitledJournal')}
                    </CardTitle>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(entry.date)}
                        </span>
                        <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                        <span className="flex items-center gap-1" style={{ color: categoryInfo.color }}>
                          {categoryInfo.icon && renderIcon(categoryInfo.icon, 'w-3 h-3')}
                          {t(`journalEditor.categories.${categoryInfo.name}`, categoryInfo.name)}
                        </span>
                      </div>
                      <span className="text-[10px] bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full whitespace-nowrap">
                        Anonymous
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 flex-grow flex flex-col gap-3 overflow-hidden">
                  <div className="text-sm text-gray-600 flex-grow">
                    {isExpanded ? (
                      <MarkdownRenderer content={entry.content} className="text-sm" />
                    ) : (
                      <div className="line-clamp-3 italic opacity-80 border-l-2 border-indigo-200 pl-3 py-1">
                        {entry.content.replace(/#[tl]-[\w-]+/g, '').slice(0, 150)}
                        {entry.content.length > 150 ? '...' : ''}
                      </div>
                    )}
                  </div>

                  {showExpandButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(entry.id)}
                      className="mt-1 text-[10px] h-7 text-muted-foreground hover:text-indigo-600 self-start p-0"
                    >
                      {isExpanded ? (
                        <><ChevronUp className="w-3 h-3 mr-1" /> 收合</>
                      ) : (
                        <><ChevronDown className="w-3 h-3 mr-1" /> 展開閱讀</>
                      )}
                    </Button>
                  )}

                  {entry.emotions && entry.emotions.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap mt-auto">
                      {entry.emotions.slice(0, 3).map((emotion) => {
                        const emotionData = EMOTIONS[emotion as EmotionKey];
                        if (!emotionData) return null;
                        return (
                          <div
                            key={emotion}
                            title={emotionData.name}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm"
                            style={{ backgroundColor: emotionData.color }}
                          >
                            {renderIcon(emotionData.icon, 'w-3.5 h-3.5')}
                          </div>
                        );
                      })}
                      {entry.emotions.length > 3 && (
                        <span className="text-[10px] text-muted-foreground self-center">
                          +{entry.emotions.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
