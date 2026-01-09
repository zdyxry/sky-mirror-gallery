import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface RefreshIndicatorProps {
  isFetching: boolean;
  lastUpdated?: Date;
}

export function RefreshIndicator({ isFetching, lastUpdated }: RefreshIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <motion.div
        animate={isFetching ? { rotate: 360 } : {}}
        transition={{ duration: 1, repeat: isFetching ? Infinity : 0, ease: 'linear' }}
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'text-primary' : ''}`} />
      </motion.div>
      <span>
        {isFetching ? '正在刷新...' : lastUpdated ? `自动刷新中` : ''}
      </span>
    </div>
  );
}
