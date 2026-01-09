import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import type { BlueskyProfile, BlueskyPost } from '@/types/bluesky';

const BLUESKY_HANDLE = 'cshuamy.bsky.social';
const API_BASE = 'https://public.api.bsky.app/xrpc';
const PAGE_SIZE = 20;

async function fetchProfile(): Promise<BlueskyProfile> {
  const response = await fetch(
    `${API_BASE}/app.bsky.actor.getProfile?actor=${BLUESKY_HANDLE}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
}

interface FeedResponse {
  feed: { post: BlueskyPost }[];
  cursor?: string;
}

async function fetchFeedPage(cursor?: string): Promise<FeedResponse> {
  const url = new URL(`${API_BASE}/app.bsky.feed.getAuthorFeed`);
  url.searchParams.set('actor', BLUESKY_HANDLE);
  url.searchParams.set('limit', String(PAGE_SIZE));
  if (cursor) {
    url.searchParams.set('cursor', cursor);
  }
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error('Failed to fetch feed');
  }
  
  return response.json();
}

export function useBlueskyProfile() {
  return useQuery({
    queryKey: ['bluesky-profile', BLUESKY_HANDLE],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}

export function useBlueskyFeed() {
  return useInfiniteQuery({
    queryKey: ['bluesky-feed', BLUESKY_HANDLE],
    queryFn: ({ pageParam }) => fetchFeedPage(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}
