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
        <Skeleton className="h-48 w-full rounded-none" />
        <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Skeleton className="w-32 h-32 rounded-full border-4 border-background" />
            <div className="flex-1 pt-4 space-y-3">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full max-w-md" />
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
      <div className="h-48 bg-gradient-to-br from-primary/30 via-secondary to-background overflow-hidden">
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
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div 
          className="flex flex-col sm:flex-row items-start gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="w-32 h-32 rounded-full border-4 border-background shadow-lg object-cover"
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {profile.displayName}
              </h1>
              <a
                href={`https://bsky.app/profile/${profile.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                @{profile.handle}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {profile.description && (
              <p className="text-muted-foreground text-sm sm:text-base mb-4 max-w-lg whitespace-pre-wrap">
                {profile.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
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
