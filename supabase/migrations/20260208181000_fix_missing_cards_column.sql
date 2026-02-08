
-- Add 'cards' column if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'journal_entries' and column_name = 'cards') then
    alter table journal_entries add column cards text[];
  end if;
end $$;

-- Ensure RLS policies are correct for journal_entries
alter table journal_entries enable row level security;

-- Drop existing policies to ensure clean state
drop policy if exists "Users can view own journal entries." on journal_entries;
drop policy if exists "Users can insert own journal entries." on journal_entries;
drop policy if exists "Users can update own journal entries." on journal_entries;
drop policy if exists "Users can delete own journal entries." on journal_entries;

-- Re-create policies
create policy "Users can view own journal entries." on journal_entries
  for select using (auth.uid() = user_id);

create policy "Users can insert own journal entries." on journal_entries
  for insert with check (auth.uid() = user_id);

create policy "Users can update own journal entries." on journal_entries
  for update using (auth.uid() = user_id);

create policy "Users can delete own journal entries." on journal_entries
  for delete using (auth.uid() = user_id);
