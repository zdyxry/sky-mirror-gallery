import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import type { BlueskyPost } from '@/types/bluesky';

interface TagFilterProps {
  posts: BlueskyPost[];
  selectedTags: string[];
  onTagChange: (tags: string[]) => void;
}

// 提取帖子中的标签 - 匹配开头的 (X) 模式，X 为单个汉字
export function extractTag(text: string): string | null {
  const match = text.match(/^[（(]([一-龥])[）)]/);
  return match ? match[1] : null;
}

// 从所有帖子中获取所有唯一标签
export function getAllTags(posts: BlueskyPost[]): string[] {
  const tags = new Set<string>();
  
  posts.forEach((post) => {
    const tag = extractTag(post.record.text || '');
    if (tag) {
      tags.add(tag);
    }
  });
  
  return Array.from(tags).sort();
}

export function TagFilter({ posts, selectedTags, onTagChange }: TagFilterProps) {
  const allTags = getAllTags(posts);
  
  if (allTags.length === 0) {
    return null;
  }

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // 取消选择
      onTagChange(selectedTags.filter(t => t !== tag));
    } else {
      // 添加选择（多选，或的关系）
      onTagChange([...selectedTags, tag]);
    }
  };

  const clearAll = () => {
    onTagChange([]);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Tag className="w-4 h-4 text-muted-foreground" />
      
      {allTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        
        return (
          <motion.button
            key={tag}
            onClick={() => handleTagClick(tag)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative px-3 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200 border
              ${isSelected 
                ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              }
            `}
          >
            {tag}
          </motion.button>
        );
      })}
      
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
  );
}
