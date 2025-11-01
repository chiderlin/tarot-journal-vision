-- Create the journal_entry_cards table
CREATE TABLE public.journal_entry_cards (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    journal_entry_id uuid NOT NULL,
    card_name text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT journal_entry_cards_pkey PRIMARY KEY (id),
    CONSTRAINT journal_entry_cards_journal_entry_id_fkey FOREIGN KEY (journal_entry_id) REFERENCES public.journal_entries(id) ON DELETE CASCADE
);

-- Add an index on journal_entry_id for faster lookups
CREATE INDEX idx_journal_entry_cards_journal_entry_id ON public.journal_entry_cards(journal_entry_id);

-- Add an index on card_name for faster analysis queries
CREATE INDEX idx_journal_entry_cards_card_name ON public.journal_entry_cards(card_name);


-- Enable Row Level Security
ALTER TABLE public.journal_entry_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- This policy is a bit more complex. It checks if the user owns the parent journal_entry.
CREATE POLICY "Users can view cards for their own journal entries"
ON public.journal_entry_cards
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.journal_entries
    WHERE journal_entries.id = journal_entry_cards.journal_entry_id
      AND journal_entries.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert cards for their own journal entries"
ON public.journal_entry_cards
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.journal_entries
    WHERE journal_entries.id = journal_entry_cards.journal_entry_id
      AND journal_entries.user_id = auth.uid()
  )
);

-- Users should not be able to update a card record directly, they should delete and re-insert if needed.
-- But for completeness, here is an update policy.
CREATE POLICY "Users can update cards for their own journal entries"
ON public.journal_entry_cards
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.journal_entries
    WHERE journal_entries.id = journal_entry_cards.journal_entry_id
      AND journal_entries.user_id = auth.uid()
  )
);


CREATE POLICY "Users can delete cards for their own journal entries"
ON public.journal_entry_cards
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.journal_entries
    WHERE journal_entries.id = journal_entry_cards.journal_entry_id
      AND journal_entries.user_id = auth.uid()
  )
);
