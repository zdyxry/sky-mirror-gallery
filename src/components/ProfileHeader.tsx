import { motion } from 'framer-motion';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import type { BlueskyProfile } from '@/types/bluesky';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileHeaderProps {
  profile?: BlueskyProfile;
  isLoading: boolean;
}

export function ProfileHeader({ profile, isLoading }: ProfileHeaderProps) {
  if (isLoading) {
    return (
      <div className="relative">
        <Skeleton className="h-32 sm:h-48 w-full rounded-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-16 relative z-10">
          <div className="flex items-end sm:items-start gap-4 sm:gap-6">
            <Skeleton className="w-20 h-20 sm:w-32 sm:h-32 rounded-full border-4 border-background shrink-0" />
            <div className="flex-1 pb-2 sm:pt-4 space-y-2 sm:space-y-3">
              <Skeleton className="h-6 sm:h-8 w-32 sm:w-48" />
              <Skeleton className="h-4 w-24 sm:w-32" />
              <Skeleton className="h-12 sm:h-16 w-full max-w-md hidden sm:block" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-32 sm:h-48 bg-gradient-to-br from-primary/30 via-secondary to-background overflow-hidden">
        {profile.banner && (
          <img 
            src={profile.banner} 
            alt="Profile banner"
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-16 relative z-10">
        <motion.div 
          className="flex items-end sm:items-start gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Avatar */}
          <motion.div
            className="shrink-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="w-20 h-20 sm:w-32 sm:h-32 rounded-full border-4 border-background shadow-lg object-cover"
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1 pb-2 sm:pt-4 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
              <h1 className="text-xl sm:text-3xl font-bold text-foreground truncate">
                {profile.displayName}
              </h1>
              <a
                href={`https://bsky.app/profile/${profile.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs sm:text-sm text-primary hover:underline"
              >
                @{profile.handle}
                <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </a>
            </div>

            {profile.description && (
              <p className="text-muted-foreground text-xs sm:text-base mb-3 sm:mb-4 max-w-lg whitespace-pre-wrap line-clamp-2 sm:line-clamp-none">
                {profile.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <div>
                <span className="font-semibold text-foreground">{profile.postsCount.toLocaleString()}</span>
                <span className="text-muted-foreground ml-1">帖子</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">{profile.followersCount.toLocaleString()}</span>
                <span className="text-muted-foreground ml-1">关注者</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">{profile.followsCount.toLocaleString()}</span>
                <span className="text-muted-foreground ml-1">正在关注</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
