import { motion } from 'framer-motion';
import { Heart, MessageCircle, Repeat2, ExternalLink, Play } from 'lucide-react';
import type { BlueskyPost } from '@/types/bluesky';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useState } from 'react';
import { extractTag } from './TagFilter';
import { MediaLightbox } from './MediaLightbox';

interface PostCardProps {
  post: BlueskyPost;
  index: number;
  onTagClick?: (tag: string) => void;
}

export function PostCard({ post, index, onTagClick }: PostCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxType, setLightboxType] = useState<'image' | 'video'>('image');
  const [initialImageIndex, setInitialImageIndex] = useState(0);
  
  const embed = post.embed;
  const hasImages = embed?.$type === 'app.bsky.embed.images#view' && embed.images;
  const hasVideo = embed?.$type === 'app.bsky.embed.video#view';
  const hasExternal = embed?.$type === 'app.bsky.embed.external#view' && embed.external;

  const postUrl = `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`;

  const timeAgo = formatDistanceToNow(new Date(post.record.createdAt), {
    addSuffix: true,
    locale: zhCN,
  });

  // 提取标签和处理后的文本
  const tag = extractTag(post.record.text || '');
  const displayText = tag 
    ? post.record.text?.replace(/^[（(][一-龥][）)]/, '').trim() 
    : post.record.text;

  const openImageLightbox = (index: number) => {
    setInitialImageIndex(index);
    setLightboxType('image');
    setLightboxOpen(true);
  };

  const openVideoLightbox = () => {
    setLightboxType('video');
    setLightboxOpen(true);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="glass-card rounded-xl overflow-hidden group hover:shadow-[var(--shadow-hover)] transition-shadow duration-300"
    >
      {/* Images */}
      {hasImages && embed.images && (
        <div className={`relative ${embed.images.length > 1 ? 'grid grid-cols-2 gap-0.5' : ''}`}>
          {embed.images.slice(0, 4).map((image, imgIndex) => (
            <div 
              key={imgIndex}
              className="relative overflow-hidden bg-secondary aspect-square cursor-pointer"
              onClick={() => openImageLightbox(imgIndex)}
            >
              <img
                src={image.thumb}
                alt={image.alt || ''}
                className={`
                  w-full h-full object-cover transition-all duration-500
                  ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                  group-hover:scale-105
                `}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors" />
            </div>
          ))}
        </div>
      )}

      {/* Video */}
      {hasVideo && embed.thumbnail && (
        <div 
          className="relative aspect-video bg-secondary overflow-hidden cursor-pointer"
          onClick={openVideoLightbox}
        >
          <img
            src={embed.thumbnail}
            alt="Video thumbnail"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-background/30 group-hover:bg-background/40 transition-colors">
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
      )}

      {/* External Link Preview */}
      {hasExternal && embed.external && (
        <div className="border-b border-border">
          {embed.external.thumb && (
            <img
              src={embed.external.thumb}
              alt=""
              className="w-full h-40 object-cover"
              loading="lazy"
            />
          )}
          <div className="p-3 bg-secondary/30">
            <p className="text-xs text-muted-foreground truncate">{embed.external.uri}</p>
            <p className="text-sm font-medium text-foreground line-clamp-1">{embed.external.title}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Tag Badge */}
        {tag && (
          <button
            onClick={() => onTagClick?.(tag)}
            className="inline-flex items-center px-2 py-0.5 mb-2 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {tag}
          </button>
        )}
        
        {/* Text */}
        {displayText && (
          <p className="text-foreground text-sm sm:text-base leading-relaxed whitespace-pre-wrap mb-4">
            {displayText}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {post.likeCount}
            </span>
            <span className="flex items-center gap-1">
              <Repeat2 className="w-3.5 h-3.5" />
              {post.repostCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {post.replyCount}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span>{timeAgo}</span>
            <a
              href={postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Media Lightbox */}
      <MediaLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        type={lightboxType}
        images={hasImages && embed.images ? embed.images : []}
        initialIndex={initialImageIndex}
        videoUrl={hasVideo ? embed.playlist : undefined}
      />
    </motion.article>
  );
}
