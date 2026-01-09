import { useState } from 'react';
import { useBlueskyProfile, useBlueskyFeed } from '@/hooks/useBlueskyFeed';
import { ProfileHeader } from '@/components/ProfileHeader';
import { FilterTabs } from '@/components/FilterTabs';
import { PostGrid, getFilterCounts } from '@/components/PostGrid';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { RefreshIndicator } from '@/components/RefreshIndicator';
import { TagFilter } from '@/components/TagFilter';
import type { ContentFilter } from '@/types/bluesky';

const Index = () => {
  const [filter, setFilter] = useState<ContentFilter>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const { data: profile, isLoading: profileLoading } = useBlueskyProfile();
  const { data: posts = [], isLoading: feedLoading, isFetching } = useBlueskyFeed();

  const counts = getFilterCounts(posts);

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BackgroundEffects />
      
      {/* Header */}
      <ProfileHeader profile={profile} isLoading={profileLoading} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter & Refresh */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <FilterTabs 
            activeFilter={filter} 
            onFilterChange={setFilter}
            counts={counts}
          />
          <RefreshIndicator isFetching={isFetching} />
        </div>

        {/* Tag Filter */}
        <div className="mb-8">
          <TagFilter 
            posts={posts} 
            selectedTags={selectedTags} 
            onTagChange={setSelectedTags} 
          />
        </div>

        {/* Posts Grid */}
        <PostGrid 
          posts={posts} 
          filter={filter} 
          selectedTags={selectedTags}
          isLoading={feedLoading} 
          onTagClick={handleTagClick}
        />
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-muted-foreground border-t border-border">
        <p>
          内容自动同步自{' '}
          <a 
            href="https://bsky.app/profile/cshuamy.bsky.social" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Bluesky
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
