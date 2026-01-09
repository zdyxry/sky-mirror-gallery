import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlueskyPost, ContentFilter } from '@/types/bluesky';
import { PostCard } from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';

interface PostGridProps {
  posts: BlueskyPost[];
  filter: ContentFilter;
  isLoading: boolean;
}

function getPostType(post: BlueskyPost): 'text' | 'images' | 'videos' {
  const embed = post.embed;
  if (embed?.$type === 'app.bsky.embed.video#view') return 'videos';
  if (embed?.$type === 'app.bsky.embed.images#view') return 'images';
  return 'text';
}

export function PostGrid({ posts, filter, isLoading }: PostGridProps) {
  const filteredPosts = useMemo(() => {
    if (filter === 'all') return posts;
    return posts.filter((post) => getPostType(post) === filter);
  }, [posts, filter]);

  if (isLoading) {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="break-inside-avoid">
            <Skeleton className={`w-full rounded-xl ${i % 3 === 0 ? 'h-80' : i % 3 === 1 ? 'h-48' : 'h-64'}`} />
          </div>
        ))}
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <p className="text-muted-foreground text-lg">暂无此类内容</p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={filter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
      >
        {filteredPosts.map((post, index) => (
          <div key={post.uri} className="break-inside-avoid">
            <PostCard post={post} index={index} />
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

export function getFilterCounts(posts: BlueskyPost[]) {
  const counts = { all: posts.length, text: 0, images: 0, videos: 0 };
  
  posts.forEach((post) => {
    const type = getPostType(post);
    counts[type]++;
  });
  
  return counts;
}
