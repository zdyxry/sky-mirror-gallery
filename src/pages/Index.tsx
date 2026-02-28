import { useState, useMemo, useEffect } from 'react';
import { Globe } from 'lucide-react';
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
  
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useBlueskyProfile();
  const { 
    data, 
    isLoading: feedLoading, 
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch: refetchFeed
  } = useBlueskyFeed();

  const handleRefresh = () => {
    refetchProfile();
    refetchFeed();
  };

  // 将分页数据展平为帖子数组
  const posts = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.feed.map(item => item.post));
  }, [data]);

  // 自动加载更多内容以获取更多标签，上限为 500 条
  useEffect(() => {
    const MAX_AUTO_POSTS = 500;
    if (hasNextPage && !isFetchingNextPage && posts.length < MAX_AUTO_POSTS) {
      // 稍微延迟一下，避免与初始加载过于密集
      const timer = setTimeout(() => {
        fetchNextPage();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasNextPage, isFetchingNextPage, posts.length, fetchNextPage]);

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

      {/* Header Navigation */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Globe className="w-5 h-5" />
              <span className="font-semibold">Decaocto</span>
            </a>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              <a
                href="/"
                className="px-3 py-1.5 text-sm font-medium text-foreground bg-accent rounded-md"
              >
                动态
              </a>
              <a
                href="/travel"
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
              >
                足迹
              </a>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Profile Header */}
      <ProfileHeader profile={profile} isLoading={profileLoading} />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Filter & Refresh */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-6">
          <FilterTabs 
            activeFilter={filter} 
            onFilterChange={setFilter}
            counts={counts}
          />
          <RefreshIndicator isFetching={isFetching} onRefresh={handleRefresh} />
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
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => fetchNextPage()}
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
