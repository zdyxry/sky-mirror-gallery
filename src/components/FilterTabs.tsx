import { motion } from 'framer-motion';
import { FileText, Image, Video, LayoutGrid } from 'lucide-react';
import type { ContentFilter } from '@/types/bluesky';

interface FilterTabsProps {
  activeFilter: ContentFilter;
  onFilterChange: (filter: ContentFilter) => void;
  counts: {
    all: number;
    text: number;
    images: number;
    videos: number;
  };
}

const filters: { value: ContentFilter; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: '全部', icon: <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
  { value: 'text', label: '文字', icon: <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
  { value: 'images', label: '图片', icon: <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
  { value: 'videos', label: '视频', icon: <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> },
];

export function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 p-1 glass-card rounded-full w-full sm:w-auto sm:max-w-fit mx-auto">
      {filters.map((filter) => {
        const count = counts[filter.value];
        const isActive = activeFilter === filter.value;
        
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`
              relative px-2 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium
              flex items-center gap-1 sm:gap-2 transition-colors duration-200 flex-1 sm:flex-none justify-center
              ${isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-full"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1 sm:gap-2">
              {filter.icon}
              <span className="hidden xs:inline sm:inline">{filter.label}</span>
              <span className={`
                text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full
                ${isActive ? 'bg-primary-foreground/20' : 'bg-muted'}
              `}>
                {count}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
