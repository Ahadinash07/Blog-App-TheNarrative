export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  twitter?: string;
  website?: string;
  postsCount: number;
  followersCount: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  trending: boolean;
  likes: number;
  views: number;
  shares?: number;
  summary?: string; // AI-generated summary
  difficulty?: 'beginner' | 'intermediate' | 'advanced'; // Content difficulty
  wordCount?: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
  mentions?: string[]; // User mentions
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'author' | 'admin';
  bio?: string;
  website?: string;
  twitter?: string;
  location?: string;
  premiumPlan?: string;
  createdAt: string;
  readingSpeed?: number; // words per minute
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  readingSpeed: number;
  notifications: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    mentions: boolean;
  };
  layout: 'magazine' | 'newspaper' | 'compact';
}

export interface UserState {
  bookmarkedPosts: string[];
  likedPosts: string[];
  likedComments: string[];
  readingHistory: string[];
  subscribedToNewsletter: boolean;
  email: string | null;
  followingAuthors: string[];
  drafts: Post[];
  readingProgress: { [postId: string]: number }; // Reading progress per post
}

export interface UIState {
  modals: {
    welcome: boolean;
    quickView: Post | null;
    createPost: boolean;
    search: boolean;
    mobileMenu: boolean;
  };
  loading: {
    auth: boolean;
    posts: boolean;
    comments: boolean;
    search: boolean;
  };
  readingProgress: number; // Global reading progress
}

export interface BlogState {
  posts: Post[];
  comments: Comment[];
  authors: Author[];
  categories: string[];
  searchQuery: string;
  selectedCategory: string | null;
  selectedTag: string | null;
  user: UserState;
  currentUser: User | null;
  isAuthenticated: boolean;
  notifications: Notification[];
  ui: UIState;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  message: string;
  read: boolean;
  createdAt: string;
  postId?: string;
  fromUser?: string;
}
