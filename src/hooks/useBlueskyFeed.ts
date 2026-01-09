import { useQuery } from '@tanstack/react-query';
import type { BlueskyProfile, BlueskyPost } from '@/types/bluesky';

const BLUESKY_HANDLE = 'cshuamy.bsky.social';
const API_BASE = 'https://public.api.bsky.app/xrpc';

async function fetchProfile(): Promise<BlueskyProfile> {
  const response = await fetch(
    `${API_BASE}/app.bsky.actor.getProfile?actor=${BLUESKY_HANDLE}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
}

async function fetchFeed(): Promise<BlueskyPost[]> {
  const response = await fetch(
    `${API_BASE}/app.bsky.feed.getAuthorFeed?actor=${BLUESKY_HANDLE}&limit=50`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch feed');
  }
  
  const data = await response.json();
  return data.feed.map((item: { post: BlueskyPost }) => item.post);
}

export function useBlueskyProfile() {
  return useQuery({
    queryKey: ['bluesky-profile', BLUESKY_HANDLE],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Auto-refresh every 10 minutes
  });
}

export function useBlueskyFeed() {
  return useQuery({
    queryKey: ['bluesky-feed', BLUESKY_HANDLE],
    queryFn: fetchFeed,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
}
