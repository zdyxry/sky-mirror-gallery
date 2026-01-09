import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RefreshIndicatorProps {
  isFetching: boolean;
  onRefresh?: () => void;
}

export function RefreshIndicator({ isFetching, onRefresh }: RefreshIndicatorProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onRefresh}
      disabled={isFetching}
      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
    >
      <motion.div
        animate={isFetching ? { rotate: 360 } : {}}
        transition={{ duration: 1, repeat: isFetching ? Infinity : 0, ease: 'linear' }}
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'text-primary' : ''}`} />
      </motion.div>
      <span>
        {isFetching ? '正在刷新...' : '刷新'}
      </span>
    </Button>
  );
}
