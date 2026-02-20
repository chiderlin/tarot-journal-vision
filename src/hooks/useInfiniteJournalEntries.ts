import { useInfiniteQuery } from '@tanstack/react-query';
import { getPaginatedJournalEntries } from '@/services/journalService';

const PAGE_SIZE = 10;

/**
 * Custom hook for infinite scrolling of journal entries
 * Uses React Query's useInfiniteQuery for efficient pagination
 */
export const useInfiniteJournalEntries = () => {
  return useInfiniteQuery({
    queryKey: ['journal-entries-infinite'],
    queryFn: ({ pageParam = 0 }) => getPaginatedJournalEntries(pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage, allPages) => {
      // If hasMore is true, return next page number, otherwise return undefined to stop
      return lastPage.hasMore ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};
