import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { JournalEntry } from '@/types/tarot';
import { format, isSameDay } from 'date-fns';
import { Plus, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { parseTarotSyntax } from './TarotCardRenderer';

interface CalendarViewProps {
  entries: JournalEntry[];
  onDateSelect: (date: Date) => void;
  onEntryEdit: (entry: JournalEntry) => void;
  onEntryDelete: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  entries,
  onDateSelect,
  onEntryEdit,
  onEntryDelete,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const daysWithEntries = useMemo(() => {
    const dates = new Set<string>();
    entries.forEach((entry) => {
      const entryDate = new Date(entry.date + 'T00:00:00');
      dates.add(format(entryDate, 'yyyy-MM-dd'));
    });
    return Array.from(dates).map((dateStr) => new Date(dateStr + 'T00:00:00'));
  }, [entries]);

  const modifiers = {
    hasEntry: daysWithEntries,
  };

  const entriesForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return entries.filter((entry) =>
      isSameDay(new Date(entry.date + 'T00:00:00'), selectedDate)
    );
  }, [entries, selectedDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
      {/* Left Column: Calendar */}
      <div className="lg:col-span-1 flex justify-center">
        <Card>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            components={{
              DayContent: (props) => {
                const isModified = modifiers.hasEntry.some((date) =>
                  isSameDay(props.date, date)
                );
                return (
                  <div className="relative flex items-center justify-center h-full w-full">
                    {props.date.getDate()}
                    {isModified && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 bg-primary rounded-full bg-black"></span>
                    )}
                  </div>
                );
              },
            }}
            className="w-full"
          />
        </Card>
      </div>

      {/* Right Column: Day Details */}

      <div className="space-y-4 col-span-2">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {selectedDate ? format(selectedDate, 'M月d日') : '請選擇日期'}
          </h2>

          {/* 限制篇數，一天最多五篇，把+新增關掉 */}
          <p className="text-gray-700 italic">一日最多五篇</p>
          {entriesForSelectedDate.length < 5 && (
            <Button
              className="bg-purple-800 hover:bg-purple-700"
              onClick={() => onDateSelect(selectedDate || new Date())}
            >
              <Plus className="w-4 h-4 mr-2" /> 新增
            </Button>
          )}
        </div>

        <div className="space-y-4 min-h-[400px]">
          {selectedDate ? (
            entriesForSelectedDate.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {entriesForSelectedDate.map((entry) => (
                  <AccordionItem value={entry.id} key={entry.id}>
                    <AccordionTrigger>
                      <div className="flex justify-between items-center w-full pr-4">
                        <p className="font-semibold truncate text-left">
                          {entry.title}
                        </p>
                        <div
                          className="flex gap-1 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEntryEdit(entry)}
                            className="h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEntryDelete(entry.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm max-w-none text-foreground">
                        {entry.content.split('\n').map((line, index) => (
                          <div key={index}>{parseTarotSyntax(line)}</div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                <CalendarIcon className="w-12 h-12 mb-4" />
                <p className="font-bold">這天沒有日記</p>
                <p className="text-sm">點擊上方按鈕來新增一篇吧！</p>
              </div>
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
              <p>請從左側選擇一天來查看日記。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
