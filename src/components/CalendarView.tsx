import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { JournalEntry } from '@/types/tarot';
import {
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
} from 'date-fns';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { parseSyntax } from './SyntaxRenderer';
import { useTranslation } from 'react-i18next';

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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useTranslation();
  const daysOfWeek = t('calendarView.daysOfWeek', {
    returnObjects: true,
  }) as string[];
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const getEntriesForDate = (date: Date) => {
    return entries.filter((entry) =>
      isSameDay(new Date(entry.date + 'T00:00:00'), date)
    );
  };

  const entriesForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return getEntriesForDate(selectedDate);
  }, [entries, selectedDate]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const handleAddEntry = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
      setIsDialogOpen(false);
    }
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          {format(currentMonth, t('calendarView.monthFormat'))}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentMonth(new Date())}>
            {t('calendarView.today')}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="overflow-hidden">
        <div className="bg-muted/50 grid grid-cols-7 border-b">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayEntries = getEntriesForDate(day);
            const isOtherMonth = !isCurrentMonth(day);
            const isTodayDate = isToday(day);

            return (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`min-h-[120px] border-b border-r p-2 cursor-pointer hover:bg-muted/30 transition-colors ${
                  isOtherMonth ? 'bg-muted/10' : ''
                } ${index % 7 === 6 ? 'border-r-0' : ''} ${
                  index >= calendarDays.length - 7 ? 'border-b-0' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`text-sm font-medium ${
                      isOtherMonth
                        ? 'text-muted-foreground/50'
                        : isTodayDate
                        ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center'
                        : ''
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayEntries.slice(0, 3).map((entry) => (
                    <div
                      key={entry.id}
                      className="text-xs p-1.5 bg-primary/10 rounded truncate hover:bg-primary/20 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEntryEdit(entry);
                      }}
                    >
                      {entry.title}
                    </div>
                  ))}
                  {dayEntries.length > 3 && (
                    <div className="text-xs text-muted-foreground pl-1.5">
                      +{dayEntries.length - 3} {t('calendarView.more')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Date Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDate &&
                format(selectedDate, t('calendarView.dialogTitleFormat'))}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {entriesForSelectedDate.length}
                {t('calendarView.entriesCount')}
              </p>
              {entriesForSelectedDate.length < 5 && (
                <Button onClick={handleAddEntry}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('calendarView.addEntry')}
                </Button>
              )}
            </div>

            {entriesForSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {entriesForSelectedDate.map((entry) => (
                  <Card key={entry.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{entry.title}</h3>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            onEntryEdit(entry);
                            setIsDialogOpen(false);
                          }}
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
                    <div className="text-sm space-y-1">
                      {entry.content
                        .split('\n')
                        .slice(0, 3)
                        .map((line, index) => (
                          <div key={index}>{parseSyntax(line)}</div>
                        ))}
                      {entry.content.split('\n').length > 3 && (
                        <p className="text-muted-foreground italic">...</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p className="text-sm">{t('calendarView.noEntries.title')}</p>
                <p className="text-xs mt-2">
                  {t('calendarView.noEntries.description')}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
