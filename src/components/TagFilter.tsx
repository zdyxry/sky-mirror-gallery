import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, ChevronDown, ChevronUp } from 'lucide-react';
import type { BlueskyPost } from '@/types/bluesky';

interface TagFilterProps {
  posts: BlueskyPost[];
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
}

const DEFAULT_VISIBLE_COUNT = 8;

// 提取帖子中的标签 - 匹配开头的 (X) 模式，X 为单个汉字
export function extractTag(text: string): string | null {
  const match = text.match(/^[（(]([一-龥])[）)]/);
  return match ? match[1] : null;
}

// 从所有帖子中获取标签及其关联帖子数量，按数量排序
export function getTagsWithCount(posts: BlueskyPost[]): { tag: string; count: number }[] {
  const tagCounts = new Map<string, number>();
  
  posts.forEach((post) => {
    const tag = extractTag(post.record.text || '');
    if (tag) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  });
  
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count); // 按数量降序
}

// 保留原函数以兼容其他地方的使用
export function getAllTags(posts: BlueskyPost[]): string[] {
  return getTagsWithCount(posts).map(item => item.tag);
}

export function TagFilter({ posts, selectedTags, onTagChange }: TagFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const tagsWithCount = getTagsWithCount(posts);
  
  if (tagsWithCount.length === 0) {
    return null;
  }

  const visibleTags = isExpanded 
    ? tagsWithCount 
    : tagsWithCount.slice(0, DEFAULT_VISIBLE_COUNT);
  
  const hiddenCount = tagsWithCount.length - DEFAULT_VISIBLE_COUNT;
  const hasMore = hiddenCount > 0;

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagChange([...selectedTags, tag]);
    }
  };

  const clearAll = () => {
    onTagChange([]);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Tag className="w-4 h-4 text-muted-foreground" />
        
        <AnimatePresence mode="popLayout">
          {visibleTags.map(({ tag, count }) => {
            const isSelected = selectedTags.includes(tag);
            
            return (
              <motion.button
                key={tag}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => handleTagClick(tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative px-3 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200 border flex items-center gap-1.5
                  ${isSelected 
                    ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                  }
                `}
              >
                {tag}
                <span className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${isSelected ? 'bg-primary-foreground/20' : 'bg-muted'}
                `}>
                  {count}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
        
        {selectedTags.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearAll}
            className="px-3 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            清除筛选
          </motion.button>
        )}
      </div>
      
      {/* 展开/收起按钮 */}
      {hasMore && (
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? (
            <>
              收起 <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              展开更多 ({hiddenCount}) <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}
