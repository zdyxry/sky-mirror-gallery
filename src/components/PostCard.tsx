import { motion } from 'framer-motion';
import { Heart, MessageCircle, Repeat2, ExternalLink, Play } from 'lucide-react';
import type { BlueskyPost } from '@/types/bluesky';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useState } from 'react';

interface PostCardProps {
  post: BlueskyPost;
  index: number;
}

export function PostCard({ post, index }: PostCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const embed = post.embed;
  const hasImages = embed?.$type === 'app.bsky.embed.images#view' && embed.images;
  const hasVideo = embed?.$type === 'app.bsky.embed.video#view';
  const hasExternal = embed?.$type === 'app.bsky.embed.external#view' && embed.external;

  const postUrl = `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`;

  const timeAgo = formatDistanceToNow(new Date(post.record.createdAt), {
    addSuffix: true,
    locale: zhCN,
  });

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
              className="relative overflow-hidden bg-secondary aspect-square"
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
            </div>
          ))}
        </div>
      )}

      {/* Video */}
      {hasVideo && embed.thumbnail && (
        <div className="relative aspect-video bg-secondary overflow-hidden">
          <img
            src={embed.thumbnail}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-background/30">
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
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
        {/* Text */}
        {post.record.text && (
          <p className="text-foreground text-sm sm:text-base leading-relaxed whitespace-pre-wrap mb-4">
            {post.record.text}
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
    </motion.article>
  );
}
