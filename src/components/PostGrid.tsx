import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlueskyPost, ContentFilter } from '@/types/bluesky';
import { PostCard } from './PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { extractTag } from './TagFilter';

interface PostGridProps {
  posts: BlueskyPost[];
  filter: ContentFilter;
  selectedTags: string[];
  isLoading: boolean;
  onTagClick: (tag: string) => void;
}

function getPostType(post: BlueskyPost): 'text' | 'images' | 'videos' {
  const embed = post.embed;
  if (embed?.$type === 'app.bsky.embed.video#view') return 'videos';
  if (embed?.$type === 'app.bsky.embed.images#view') return 'images';
  return 'text';
}

export function PostGrid({ posts, filter, selectedTags, isLoading, onTagClick }: PostGridProps) {
  const filteredPosts = useMemo(() => {
    let result = posts;
    
    // 内容类型筛选
    if (filter !== 'all') {
      result = result.filter((post) => getPostType(post) === filter);
    }
    
    // 标签筛选（多选，或的关系）
    if (selectedTags.length > 0) {
      result = result.filter((post) => {
        const tag = extractTag(post.record.text || '');
        return tag && selectedTags.includes(tag);
      });
    }
    
    return result;
  }, [posts, filter, selectedTags]);

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
            <PostCard post={post} index={index} onTagClick={onTagClick} />
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
