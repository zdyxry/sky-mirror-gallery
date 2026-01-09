export interface BlueskyProfile {
  did: string;
  handle: string;
  displayName: string;
  description: string;
  avatar: string;
  banner?: string;
  followersCount: number;
  followsCount: number;
  postsCount: number;
}

export interface BlueskyEmbed {
  $type: string;
  images?: Array<{
    thumb: string;
    fullsize: string;
    alt: string;
    aspectRatio?: { width: number; height: number };
  }>;
  external?: {
    uri: string;
    title: string;
    description: string;
    thumb?: string;
  };
  playlist?: string;
  thumbnail?: string;
  aspectRatio?: { width: number; height: number };
}

export interface BlueskyPost {
  uri: string;
  cid: string;
  author: {
    did: string;
    handle: string;
    displayName: string;
    avatar: string;
  };
  record: {
    text: string;
    createdAt: string;
    embed?: BlueskyEmbed;
  };
  embed?: BlueskyEmbed;
  replyCount: number;
  repostCount: number;
  likeCount: number;
  indexedAt: string;
}

export type ContentFilter = 'all' | 'text' | 'images' | 'videos';
