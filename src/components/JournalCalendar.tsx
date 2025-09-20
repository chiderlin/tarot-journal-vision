import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JournalEntry, Category } from '@/types/tarot';
import { Plus, Calendar as CalendarIcon, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

interface JournalCalendarProps {
  entries: JournalEntry[];
  categories: Category[];
  onCreateEntry: (date: string) => void;
  onEditEntry: (entry: JournalEntry) => void;
}

export const JournalCalendar: React.FC<JournalCalendarProps> = ({
  entries,
  categories,
  onCreateEntry,
  onEditEntry,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get entries for selected date
  const getEntriesForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return entries.filter(entry => 
      entry.date.startsWith(dateString)
    );
  };

  // Get dates that have entries
  const getDatesWithEntries = () => {
    return entries.map(entry => new Date(entry.date));
  };

  const getCategoryInfo = (categoryName: string) => {
    return categories.find(cat => cat.name === categoryName) || 
           { name: categoryName, color: 'hsl(var(--muted))', icon: '📝' };
  };

  const selectedDateEntries = selectedDate ? getEntriesForDate(selectedDate) : [];
  const datesWithEntries = getDatesWithEntries();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
          日記行事曆
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border border-border pointer-events-auto"
              modifiers={{
                hasEntry: datesWithEntries,
              }}
              modifiersStyles={{
                hasEntry: {
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))',
                  fontWeight: 'bold',
                },
              }}
            />
          </div>

          {/* Selected Date Info */}
          <div className="space-y-4">
            {selectedDate && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {format(selectedDate, 'yyyy年M月d日')}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCreateEntry(format(selectedDate, 'yyyy-MM-dd'))}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    新增日記
                  </Button>
                </div>

                {selectedDateEntries.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4 mr-1" />
                      共 {selectedDateEntries.length} 篇日記
                    </div>
                    
                    {selectedDateEntries.map((entry) => {
                      const categoryInfo = getCategoryInfo(entry.category);
                      return (
                        <Card 
                          key={entry.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => onEditEntry(entry)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{entry.title}</h4>
                                <Badge 
                                  variant="secondary"
                                  style={{ 
                                    backgroundColor: `${categoryInfo.color}20`, 
                                    color: categoryInfo.color 
                                  }}
                                >
                                  {categoryInfo.icon} {categoryInfo.name}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {entry.content.replace(/#[a-zA-Z]+(-reversed)?/g, '').substring(0, 100)}...
                              </p>
                              {entry.cards.length > 0 && (
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <span>使用牌卡: {entry.cards.join(', ')}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📅</div>
                    <p className="text-muted-foreground text-sm">這天還沒有日記</p>
                    <p className="text-muted-foreground text-xs mt-1">點擊上方按鈕開始記錄</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};