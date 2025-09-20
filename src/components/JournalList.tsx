import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TarotCardRenderer, parseTarotSyntax } from './TarotCardRenderer';
import { JournalEntry, Category } from '@/types/tarot';
import { Edit, Trash2, Search, Calendar, Tag } from 'lucide-react';

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

  const filteredAndSortedEntries = entries
    .filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  const getCategoryInfo = (categoryName: string) => {
    return categories.find(cat => cat.name === categoryName) || 
           { name: categoryName, color: 'hsl(var(--muted))', icon: '📝' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
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
                placeholder="搜尋日記..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="選擇分類" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有分類</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: 'date' | 'title') => setSortBy(value)}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">依日期排序</SelectItem>
                <SelectItem value="title">依標題排序</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              共 {filteredAndSortedEntries.length} 筆日記
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries */}
      <div className="grid gap-4">
        {filteredAndSortedEntries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">沒有找到符合條件的日記</p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedEntries.map((entry) => {
            const categoryInfo = getCategoryInfo(entry.category);
            
            return (
              <Card key={entry.id} className="hover:shadow-xl transition-all duration-300 group">
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
                          style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {categoryInfo.icon} {categoryInfo.name}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                
                <CardContent className="space-y-4">
                  {/* Cards used in this entry */}
                  {entry.cards.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.cards.map((cardName, index) => (
                        <TarotCardRenderer
                          key={`${entry.id}-${cardName}-${index}`}
                          cardName={cardName}
                          size="small"
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Content preview */}
                  <div className="prose prose-sm max-w-none text-foreground">
                    <div className="leading-relaxed">
                      {parseTarotSyntax(truncateContent(entry.content))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};