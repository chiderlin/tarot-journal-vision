import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JournalEditor } from '@/components/JournalEditor';
import { JournalList } from '@/components/JournalList';
import { CalendarView } from '@/components/CalendarView';
import { AnalysisView } from '@/components/AnalysisView';
import { JournalEntry, Category, DEFAULT_CATEGORIES } from '@/types/tarot';
import {
  Plus,
  BookOpen,
  Sparkles,
  TrendingUp,
  List,
  CalendarDays,
  PieChart,
  LogOut,
} from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DailyGuidance } from '@/components/DailyGuidance';

const Index = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [currentView, setCurrentView] = useState<
    'list' | 'calendar' | 'editor' | 'analysis'
  >('list');
  const [editingEntry, setEditingEntry] = useState<JournalEntry | undefined>();

  // Fetch entries from Supabase
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['journal-entries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        toast.error('Failed to fetch entries');
        throw error;
      }
      
      return (data || []).map((item) => ({
        ...item,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })) as JournalEntry[];
    },
  });

  // Create entry mutation
  const createEntryMutation = useMutation({
    mutationFn: async (newEntry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          ...newEntry,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast.success(t('journalEditor.saveSuccess') || 'Entry saved successfully');
      setCurrentView('list');
      setEditingEntry(undefined);
    },
    onError: (error) => {
      console.error('Error creating entry:', error);
      toast.error('Failed to create entry');
    },
  });

  // Update entry mutation
  const updateEntryMutation = useMutation({
    mutationFn: async (entry: JournalEntry) => {
      const { error } = await supabase
        .from('journal_entries')
        .update({
          title: entry.title,
          content: entry.content,
          category: entry.category,
          date: entry.date,
          cards: entry.cards,
          updated_at: new Date().toISOString(),
        })
        .eq('id', entry.id);

      if (error) throw error;
      return entry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast.success(t('journalEditor.saveSuccess') || 'Entry updated successfully');
      setCurrentView('list');
      setEditingEntry(undefined);
    },
    onError: (error) => {
      console.error('Error updating entry:', error);
      toast.error('Failed to update entry');
    },
  });

  // Delete entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast.success('Entry deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    },
  });

  const handleSaveEntry = (
    entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingEntry && editingEntry.id) {
      updateEntryMutation.mutate({
        ...editingEntry,
        ...entryData,
        updatedAt: new Date().toISOString(), // This is just for local typings, DB handles it
      });
    } else {
      createEntryMutation.mutate(entryData);
    }
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setCurrentView('editor');
  };

  const handleNewEntryForDate = (date: Date) => {
    setEditingEntry({
      id: '', // Empty id signifies a new entry
      title: '',
      content: '',
      category: DEFAULT_CATEGORIES[0]?.name || '',
      date: format(date, 'yyyy-MM-dd'),
      cards: [],
      createdAt: '',
      updatedAt: '',
    });
    setCurrentView('editor');
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm(t('indexPage.deleteConfirmation'))) {
      deleteEntryMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingEntry(undefined);
  };

  const handleSignOut = async () => {
      await supabase.auth.signOut();
  };

  // Statistics
  const totalEntries = entries.length;
  // Use DEFAULT_CATEGORIES for now as we don't have a categories table
  const categories = DEFAULT_CATEGORIES;
    
  const categoryCounts = categories.map((category) => ({
    ...category,
    count: entries.filter((entry) => entry.category === category.name).length,
  }));
  const sortedCategoryCounts = [...categoryCounts].sort(
    (a, b) => b.count - a.count
  );

  // Most frequent cards
  const cardFrequency: Record<string, number> = {};
  entries.forEach((entry) => {
    entry.cards?.forEach((card) => {
      cardFrequency[card] = (cardFrequency[card] || 0) + 1;
    });
  });

  // Get the single most frequent card (or first one if there's a tie)
  // Sort by frequency descending, then by card name alphabetically for consistency
  let mostFrequentCard: { name: string; count: number } | null = null;
  if (Object.keys(cardFrequency).length > 0) {
    const sortedCards = Object.entries(cardFrequency).sort(
      ([nameA, countA], [nameB, countB]) => {
        // First sort by count (descending)
        if (countB !== countA) {
          return countB - countA;
        }
        // If counts are equal, sort alphabetically by name for consistency
        return nameA.localeCompare(nameB);
      }
    );
    const [topCardName, topCardCount] = sortedCards[0];
    mostFrequentCard = { name: topCardName, count: topCardCount };
  }

  if (currentView === 'editor') {
    return (
      <div className="min-h-screen simple-bg p-4">
        <div className="container mx-auto py-8">
          <JournalEditor
            entry={editingEntry}
            categories={categories}
            onSave={handleSaveEntry}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen simple-bg">
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex justify-end items-center gap-4">
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" onClick={handleSignOut} title={t('auth.signOut') || "Sign Out"}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-600 ">
            <Sparkles className="inline w-12 h-12 mr-4 text-primary text-yellow-500" />
            {t('indexPage.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {t('indexPage.subtitle')}
          </p>
          <Button
            variant="default"
            size="lg"
            onClick={() => setCurrentView('editor')}
            className="bg-purple-800 hover:bg-purple-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            {t('indexPage.newEntryButton')}
          </Button>
        </div>

        {/* Daily Guidance */}
        <div className="max-w-4xl mx-auto">
          <DailyGuidance />
        </div>

        <div className="flex justify-center mb-8">
          <ToggleGroup
            type="single"
            value={currentView}
            onValueChange={(view) => {
              if (view)
                setCurrentView(view as 'list' | 'calendar' | 'analysis');
            }}
            defaultValue="list"
          >
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4 mr-2" />
              {t('indexPage.listView')}
            </ToggleGroupItem>
            <ToggleGroupItem value="calendar" aria-label="Calendar view">
              <CalendarDays className="h-4 w-4 mr-2" />
              {t('indexPage.calendarView')}
            </ToggleGroupItem>
            <ToggleGroupItem value="analysis" aria-label="Analysis view">
              <PieChart className="h-4 w-4 mr-2" />
              {t('indexPage.analysisView')}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Statistics */}
        {currentView !== 'analysis' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary" />
                  {t('indexPage.totalEntriesCardTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                ) : (
                    <>
                    <div className="text-3xl font-bold text-purple-600">
                    {totalEntries}
                    </div>
                    <p className="text-muted-foreground text-sm">
                    {t('indexPage.entriesCountSuffix')}
                    </p>
                    </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-start">
                  <TrendingUp className="w-5 h-5 mr-2 text-accent text-black" />
                  {t('indexPage.mostFrequentCardTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mostFrequentCard ? (
                  <div>
                    <div className="text-m text-gray-900 capitalize">
                      {/* Try tarot cards first, then lenormand cards */}
                      {t(`tarotCards.${mostFrequentCard.name}.name`, {
                        defaultValue: t(
                          `lenormandCards.${mostFrequentCard.name}.name`,
                          {
                            defaultValue: mostFrequentCard.name,
                          }
                        ),
                      })}
                    </div>
                    <p className="text-muted-foreground  text-sm">
                      {t('indexPage.cardOccurrence', {
                        count: mostFrequentCard.count,
                      })}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {t('indexPage.noData')}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {t('indexPage.categoryStatsTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {sortedCategoryCounts.slice(0, 3).map((category) => (
                    <div
                      key={category.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-m">
                        {category.icon} -{' '}
                        {t(
                          `journalEditor.categories.${category.name}`,
                          category.name
                        )}
                      </span>
                      <span className="text-sm font-medium">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        {isLoading ? (
             <div className="text-center py-12">Loading entries...</div>
        ) : (
            <>
                {currentView === 'list' && (
                <JournalList
                    entries={entries}
                    categories={categories}
                    onEdit={handleEditEntry}
                    onDelete={handleDeleteEntry}
                />
                )}

                {currentView === 'calendar' && (
                <CalendarView
                    entries={entries}
                    onDateSelect={handleNewEntryForDate}
                    onEntryEdit={handleEditEntry}
                    onEntryDelete={handleDeleteEntry}
                />
                )}

                {currentView === 'analysis' && <AnalysisView entries={entries} />}

                {entries.length === 0 &&
                currentView !== 'calendar' &&
                currentView !== 'analysis' && (
                    <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔮</div>
                    <h2 className="text-2xl font-bold mb-4">
                        {t('indexPage.welcomeTitle')}
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        {t('indexPage.welcomeMessage')}
                    </p>
                    <Button
                        variant="default"
                        size="lg"
                        onClick={() => setCurrentView('editor')}
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        {t('indexPage.createFirstEntryButton')}
                    </Button>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default Index;
