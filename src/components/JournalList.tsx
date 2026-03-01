import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { parseSyntax } from './SyntaxRenderer';
import { JournalEntry, Category } from '@/types/tarot';
import { EMOTIONS, EmotionKey } from '@/types/emotions';
import {
  Edit,
  Trash2,
  Search,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  Share2,
  FileText,
  Smile,
  Frown,
  AlertCircle,
  Flower2,
  HelpCircle,
  Heart,
  Zap,
  Minus,
  Briefcase,
  Users,
  Sparkles,
  Sunrise,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ShareDialog } from './ShareDialog';

// 圖標映射
const iconMap: Record<string, LucideIcon> = {
  Smile,
  Frown,
  AlertCircle,
  Flower2,
  HelpCircle,
  Heart,
  Zap,
  Minus,
  Briefcase,
  Users,
  Sparkles,
  Sunrise,
  FileText,
};

// 渲染圖標的輔助函數
const renderIcon = (iconName: string, className: string = 'w-4 h-4') => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent className={className} /> : null;
};

interface JournalListProps {
  entries: JournalEntry[];
  categories: Category[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export const JournalList: React.FC<JournalListProps> = ({
  entries,
  categories,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(
    new Set()
  );
  const [shareEntry, setShareEntry] = useState<JournalEntry | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(20); // 初始顯示 20 篇
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const filteredAndSortedEntries = entries
    .filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || entry.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  const getCategoryInfo = (categoryName: string) => {
    return (
      categories.find((cat) => cat.name === categoryName) || {
        name: categoryName,
        color: 'hsl(var(--muted))',
        icon: 'FileText',
      }
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPreviewLines = (content: string, maxLines: number = 3) => {
    const lines = content.split('\n').filter((line) => line.trim() !== '');
    return lines.slice(0, maxLines).join('\n');
  };

  const shouldShowExpandButton = (content: string, maxLines: number = 3) => {
    const lines = content.split('\n').filter((line) => line.trim() !== '');
    return lines.length > maxLines;
  };

  const toggleExpand = (entryId: string) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  const handleShare = (entry: JournalEntry) => {
    setShareEntry(entry);
    setShareDialogOpen(true);
  };

  // 無限捲動：當搜尋或分類改變時，重置顯示數量
  useEffect(() => {
    setDisplayedCount(20);
  }, [searchTerm, selectedCategory, sortBy]);

  // 無限捲動：使用 Intersection Observer 監測底部元素
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          displayedCount < filteredAndSortedEntries.length
        ) {
          // 每次載入 20 篇
          setDisplayedCount((prev) =>
            Math.min(prev + 20, filteredAndSortedEntries.length)
          );
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [displayedCount, filteredAndSortedEntries.length]);

  // 只顯示前 N 篇日記
  const displayedEntries = filteredAndSortedEntries.slice(0, displayedCount);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('journalList.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue
                  placeholder={t('journalList.categorySelectPlaceholder')}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('journalList.allCategories')}
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    <span className="flex items-center gap-1">
                      {category.icon && renderIcon(category.icon, 'w-4 h-4')}{' '}
                      {t(
                        `journalEditor.categories.${category.name}`,
                        category.name
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value: 'date' | 'title') => setSortBy(value)}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">
                  {t('journalList.sortByDate')}
                </SelectItem>
                <SelectItem value="title">
                  {t('journalList.sortByTitle')}
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              <Calendar className="w-4 h-4 mr-1" />{' '}
              {filteredAndSortedEntries.length} {t('journalList.totalEntries')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries */}
      <div className="grid gap-4">
        {displayedEntries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {t('journalList.noEntriesFound')}
              </p>
            </CardContent>
          </Card>
        ) : (
          displayedEntries.map((entry) => {
            const categoryInfo = getCategoryInfo(entry.category);
            const isExpanded = expandedEntries.has(entry.id);
            const showExpandButton = shouldShowExpandButton(entry.content);
            const displayContent = isExpanded
              ? entry.content
              : getPreviewLines(entry.content);

            return (
              <Card
                key={entry.id}
                className="hover:shadow-xl transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{entry.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(entry.date)}
                        <Badge
                          variant="secondary"
                          className="ml-2"
                          style={{
                            backgroundColor: `${categoryInfo.color}20`,
                            color: categoryInfo.color,
                          }}
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {categoryInfo.icon &&
                            renderIcon(categoryInfo.icon, 'w-3 h-3')}{' '}
                          {t(
                            `journalEditor.categories.${categoryInfo.name}`,
                            categoryInfo.name
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(entry)}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(entry)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(entry.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* 情緒標籤 */}
                  {entry.emotions && entry.emotions.length > 0 && (
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {entry.emotions.map((emotion) => {
                        const emotionData = EMOTIONS[emotion as EmotionKey];
                        const isPrimary = emotion === entry.primary_emotion;
                        const intensity =
                          entry.emotion_intensities?.[emotion] || 5;

                        return (
                          <Badge
                            key={emotion}
                            className={`inline-flex items-center gap-1 text-white ${
                              isPrimary ? 'ring-2 ring-yellow-400' : ''
                            }`}
                            style={{ backgroundColor: emotionData.color }}
                          >
                            {renderIcon(emotionData.icon, 'w-3 h-3')}{' '}
                            {emotionData.name}
                            {isPrimary && ' ★'}
                            <span className="text-xs ml-1 opacity-80">
                              {intensity}/10
                            </span>
                          </Badge>
                        );
                      })}
                    </div>
                  )}

                  {/* Content preview */}
                  <MarkdownRenderer
                    content={displayContent}
                    className="text-sm"
                  />

                  {/* Expand/Collapse button */}
                  {showExpandButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(entry.id)}
                      className="mt-3 text-muted-foreground hover:text-foreground"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          收合
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          展開閱讀
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}

        {/* 載入更多指示器 */}
        {displayedCount < filteredAndSortedEntries.length && (
          <div
            ref={loadMoreRef}
            className="flex justify-center items-center py-8"
          >
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
              />
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Share Dialog */}
      <ShareDialog
        entry={shareEntry}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  );
};
