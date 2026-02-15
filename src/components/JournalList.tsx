import React, { useState } from 'react';
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
import { Edit, Trash2, Search, Calendar, Tag, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ShareDialog } from './ShareDialog';

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
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [shareEntry, setShareEntry] = useState<JournalEntry | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
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
        icon: '📝',
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
    const lines = content.split('\n').filter(line => line.trim() !== '');
    return lines.slice(0, maxLines).join('\n');
  };

  const shouldShowExpandButton = (content: string, maxLines: number = 3) => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    return lines.length > maxLines;
  };

  const toggleExpand = (entryId: string) => {
    setExpandedEntries(prev => {
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
                    {category.icon}{' '}
                    {t(
                      `journalEditor.categories.${category.name}`,
                      category.name
                    )}
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
        {filteredAndSortedEntries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {t('journalList.noEntriesFound')}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedEntries.map((entry) => {
            const categoryInfo = getCategoryInfo(entry.category);
            const isExpanded = expandedEntries.has(entry.id);
            const showExpandButton = shouldShowExpandButton(entry.content);
            const displayContent = isExpanded ? entry.content : getPreviewLines(entry.content);

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
                          {categoryInfo.icon}{' '}
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
                  {/* Content preview */}
                  <MarkdownRenderer content={displayContent} className="text-sm" />
                  
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
