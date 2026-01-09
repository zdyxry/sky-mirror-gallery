import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'image' | 'video';
  images?: Array<{
    thumb: string;
    fullsize: string;
    alt: string;
  }>;
  initialIndex?: number;
  videoUrl?: string;
  videoThumbnail?: string;
}

export function MediaLightbox({
  isOpen,
  onClose,
  type,
  images = [],
  initialIndex = 0,
  videoUrl,
}: MediaLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (type === 'image' && images.length > 1) {
        if (e.key === 'ArrowLeft') goToPrev();
        if (e.key === 'ArrowRight') goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, type, images.length, currentIndex]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const lightboxContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-card/80 text-foreground hover:bg-card transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image viewer */}
          {type === 'image' && images.length > 0 && (
            <>
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                src={images[currentIndex].fullsize}
                alt={images[currentIndex].alt || ''}
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrev();
                    }}
                    className="absolute left-4 p-3 rounded-full bg-card/80 text-foreground hover:bg-card transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-4 p-3 rounded-full bg-card/80 text-foreground hover:bg-card transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Image counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-card/80 text-sm text-foreground">
                    {currentIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </>
          )}

          {/* Video player */}
          {type === 'video' && videoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-[90vw] max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full rounded-lg shadow-2xl bg-black"
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // 使用 Portal 渲染到 body，确保全屏覆盖
  return createPortal(lightboxContent, document.body);
}
