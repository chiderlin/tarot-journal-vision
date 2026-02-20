// FIXME: Implement error handling and logging for all service functions
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { JournalEntry } from '@/types/tarot';

// Type alias for the database entry schema
type JournalEntrySchema =
  Database['public']['Tables']['journal_entries']['Row'];

// Helper to map from DB schema to application type
const mapToJournalEntry = (entry: any): JournalEntry => {
  // Extract card names from journal_entry_cards array
  const cards = entry.journal_entry_cards
    ? (entry.journal_entry_cards as any[]).map((card: any) => card.card_name)
    : entry.cards || [];

  return {
    id: entry.id,
    title: entry.title,
    content: entry.content || '',
    category: entry.category || '',
    date: entry.date,
    cards,
    emotions: entry.emotions || [],
    primary_emotion: entry.primary_emotion || null,
    emotion_intensities:
      (entry.emotion_intensities as Record<string, number>) || {},
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
  };
};

/**
 * Fetches all journal entries for the current user.
 */
export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  const { data, error } = await (supabase
    .from('journal_entries')
    .select(
      `
      *,
      journal_entry_cards (
        card_name
      )
    `
    )
    .order('date', { ascending: false }) as any);

  if (error) {
    console.error('Error fetching journal entries:', error);
    throw error;
  }

  return data.map(mapToJournalEntry);
};

export interface PaginatedJournalEntriesResponse {
  entries: JournalEntry[];
  hasMore: boolean;
  total: number;
}

/**
 * Fetches paginated journal entries for the current user.
 * @param page - Page number (0-indexed)
 * @param pageSize - Number of entries per page
 */
export const getPaginatedJournalEntries = async (
  page: number = 0,
  pageSize: number = 10
): Promise<PaginatedJournalEntriesResponse> => {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  // Get paginated data with count in a single query
  const { data, error, count } = await (supabase
    .from('journal_entries')
    .select(
      `
      *,
      journal_entry_cards (
        card_name
      )
    `,
      { count: 'exact' }
    )
    .order('date', { ascending: false })
    .range(from, to) as any);

  if (error) {
    console.error('Error fetching paginated journal entries:', error);
    throw error;
  }

  const entries = data.map(mapToJournalEntry);
  const total = count || 0;
  const hasMore = (page + 1) * pageSize < total;

  return {
    entries,
    hasMore,
    total,
  };
};

/**
 * Deletes a journal entry by its ID.
 */
export const deleteJournalEntry = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting journal entry:', error);
    throw error;
  }
};

/**
 * Creates a new journal entry.
 */
export const createJournalEntry = async (
  entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<JournalEntry> => {
  const { cards, ...restOfEntry } = entryData;
  const { data: userResponse } = await supabase.auth.getUser();
  if (!userResponse.user) throw new Error('User not authenticated');

  // 1. Insert the main entry
  const { data: newEntry, error: entryError } = await supabase
    .from('journal_entries')
    .insert({
      ...restOfEntry,
      user_id: userResponse.user.id,
    })
    .select()
    .single();

  if (entryError) {
    console.error('Error creating journal entry:', entryError);
    throw entryError;
  }

  // 2. Insert the associated cards
  if (cards && cards.length > 0) {
    const cardRecords = cards.map((card_name) => ({
      journal_entry_id: newEntry.id,
      card_name,
    }));
    const { error: cardsError } = await (supabase
      .from('journal_entry_cards')
      .insert(cardRecords) as any);

    if (cardsError) {
      console.error('Error inserting cards:', cardsError);
      throw cardsError;
    }
  }

  // 3. Return the complete entry object
  return {
    ...mapToJournalEntry({
      ...newEntry,
      journal_entry_cards: cards.map((c) => ({ card_name: c })),
    }),
  };
};

/**
 * Updates an existing journal entry.
 */
export const updateJournalEntry = async (
  id: string,
  entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<JournalEntry> => {
  const { cards, ...restOfEntry } = entryData;

  // 1. Update the main entry
  const { data: updatedEntry, error: entryError } = await supabase
    .from('journal_entries')
    .update(restOfEntry)
    .eq('id', id)
    .select()
    .single();

  if (entryError) {
    console.error('Error updating journal entry:', entryError);
    throw entryError;
  }

  // 2. Delete old cards for this entry
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: deleteError } = await (supabase
    .from('journal_entry_cards')
    .delete()
    .eq('journal_entry_id', id) as any);

  if (deleteError) {
    console.error('Error deleting old cards:', deleteError);
    throw deleteError;
  }

  // 3. Insert new cards for this entry
  if (cards && cards.length > 0) {
    const cardRecords = cards.map((card_name) => ({
      journal_entry_id: id,
      card_name,
    }));
    const { error: insertError } = await (supabase
      .from('journal_entry_cards')
      .insert(cardRecords) as any);

    if (insertError) {
      console.error('Error inserting new cards:', insertError);
      throw insertError;
    }
  }

  // 4. Return the complete entry object
  return {
    ...mapToJournalEntry({
      ...updatedEntry,
      journal_entry_cards: cards.map((c) => ({ card_name: c })),
    }),
  };
};
