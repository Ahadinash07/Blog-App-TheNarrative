import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BlogState, Comment, Post, User, Notification } from '../types/blog';
import { posts, comments, authors, categories } from '../data/mockData';

// Load persisted state from localStorage
const loadPersistedState = () => {
  try {
    const serializedState = localStorage.getItem('blog-state');
    if (serializedState) {
      const parsed = JSON.parse(serializedState);
      return {
        user: parsed.user || undefined,
        currentUser: parsed.currentUser || null,
        isAuthenticated: parsed.isAuthenticated || false,
      };
    }
  } catch (e) {
    console.error('Failed to load persisted state:', e);
  }
  return {
    user: undefined,
    currentUser: null,
    isAuthenticated: false,
  };
};

const persistedState = loadPersistedState();

const initialState: BlogState = {
  posts,
  comments,
  authors,
  categories,
  searchQuery: '',
  selectedCategory: null,
  selectedTag: null,
  user: persistedState.user || {
    bookmarkedPosts: [],
    likedPosts: [],
    likedComments: [],
    readingHistory: [],
    subscribedToNewsletter: false,
    email: null,
    followingAuthors: [],
    drafts: [],
    readingProgress: {},
  },
  currentUser: persistedState.currentUser,
  isAuthenticated: persistedState.isAuthenticated,
  notifications: [],
  ui: {
    modals: {
      welcome: false,
      quickView: null,
      createPost: false,
      search: false,
      mobileMenu: false,
    },
    loading: {
      auth: false,
      posts: false,
      comments: false,
      search: false,
    },
    readingProgress: 0,
  },
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedTag: (state, action: PayloadAction<string | null>) => {
      state.selectedTag = action.payload;
    },
    toggleBookmark: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const index = state.user.bookmarkedPosts.indexOf(postId);
      if (index === -1) {
        state.user.bookmarkedPosts.push(postId);
      } else {
        state.user.bookmarkedPosts.splice(index, 1);
      }
      saveToLocalStorage(state);
    },
    togglePostLike: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const index = state.user.likedPosts.indexOf(postId);
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        if (index === -1) {
          state.user.likedPosts.push(postId);
          post.likes += 1;
        } else {
          state.user.likedPosts.splice(index, 1);
          post.likes -= 1;
        }
      }
      saveToLocalStorage(state);
    },
    toggleCommentLike: (state, action: PayloadAction<string>) => {
      const commentId = action.payload;
      const index = state.user.likedComments.indexOf(commentId);
      
      const findAndToggle = (comments: Comment[]): boolean => {
        for (const comment of comments) {
          if (comment.id === commentId) {
            if (index === -1) {
              comment.likes += 1;
            } else {
              comment.likes -= 1;
            }
            return true;
          }
          if (comment.replies && findAndToggle(comment.replies)) {
            return true;
          }
        }
        return false;
      };

      findAndToggle(state.comments);
      
      if (index === -1) {
        state.user.likedComments.push(commentId);
      } else {
        state.user.likedComments.splice(index, 1);
      }
    },
    addComment: (state, action: PayloadAction<{ postId: string; content: string; authorName: string }>) => {
      const { postId, content, authorName } = action.payload;
      const newComment: Comment = {
        id: `${Date.now()}`,
        postId,
        author: {
          name: authorName,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`,
        },
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      state.comments.push(newComment);
    },
    addReply: (state, action: PayloadAction<{ commentId: string; content: string; authorName: string; postId: string }>) => {
      const { commentId, content, authorName, postId } = action.payload;
      const newReply: Comment = {
        id: `${commentId}-${Date.now()}`,
        postId,
        author: {
          name: authorName,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`,
        },
        content,
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      
      const comment = state.comments.find(c => c.id === commentId);
      if (comment) {
        if (!comment.replies) {
          comment.replies = [];
        }
        comment.replies.push(newReply);
      }
    },
    addToReadingHistory: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const index = state.user.readingHistory.indexOf(postId);
      if (index !== -1) {
        state.user.readingHistory.splice(index, 1);
      }
      state.user.readingHistory.unshift(postId);
      if (state.user.readingHistory.length > 20) {
        state.user.readingHistory = state.user.readingHistory.slice(0, 20);
      }
      saveToLocalStorage(state);
    },
    incrementPostViews: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        post.views += 1;
      }
    },
    subscribeToNewsletter: (state, action: PayloadAction<string>) => {
      state.user.subscribedToNewsletter = true;
      state.user.email = action.payload;
      saveToLocalStorage(state);
    },
    // Auth actions
    loginUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      saveToLocalStorage(state);
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      saveToLocalStorage(state);
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        saveToLocalStorage(state);
      }
    },
    // Post actions
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(p => p.id !== action.payload);
    },
    // Draft actions
    saveDraft: (state, action: PayloadAction<Post>) => {
      const index = state.user.drafts.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.user.drafts[index] = action.payload;
      } else {
        state.user.drafts.push(action.payload);
      }
      saveToLocalStorage(state);
    },
    deleteDraft: (state, action: PayloadAction<string>) => {
      state.user.drafts = state.user.drafts.filter(d => d.id !== action.payload);
      saveToLocalStorage(state);
    },
    // Follow actions
    toggleFollowAuthor: (state, action: PayloadAction<string>) => {
      const authorId = action.payload;
      const index = state.user.followingAuthors.indexOf(authorId);
      if (index !== -1) {
        state.user.followingAuthors.splice(index, 1);
      } else {
        state.user.followingAuthors.push(authorId);
      }
      saveToLocalStorage(state);
    },
    // Notification actions
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt' | 'read'>>) => {
      state.notifications.unshift({
        ...action.payload,
        id: `notif-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
      });
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) {
        notif.read = true;
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
    clearReadingHistory: (state) => {
      state.user.readingHistory = [];
      saveToLocalStorage(state);
    },
    // UI State Management
    setModalState: (state, action: PayloadAction<{ modal: keyof UIState['modals']; value: boolean | Post | null }>) => {
      const { modal, value } = action.payload;
      state.ui.modals[modal] = value as UIState['modals'][typeof modal];
    },
    setLoadingState: (state, action: PayloadAction<{ key: keyof UIState['loading']; value: boolean }>) => {
      const { key, value } = action.payload;
      state.ui.loading[key] = value;
    },
    setReadingProgress: (state, action: PayloadAction<{ postId?: string; progress: number }>) => {
      const { postId, progress } = action.payload;
      if (postId) {
        state.user.readingProgress[postId] = progress;
        saveToLocalStorage(state);
      } else {
        state.ui.readingProgress = progress;
      }
    },
    // Enhanced Post Features
    updatePostSummary: (state, action: PayloadAction<{ postId: string; summary: string }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.summary = action.payload.summary;
      }
    },
    updatePostDifficulty: (state, action: PayloadAction<{ postId: string; difficulty: 'beginner' | 'intermediate' | 'advanced' }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.difficulty = action.payload.difficulty;
      }
    },
    // Enhanced Comment Features
    addMention: (state, action: PayloadAction<{ commentId: string; mentions: string[] }>) => {
      const comment = state.comments.find(c => c.id === action.payload.commentId);
      if (comment) {
        comment.mentions = action.payload.mentions;
        // Create notifications for mentions
        action.payload.mentions.forEach(userId => {
          state.notifications.unshift({
            id: `mention-${Date.now()}-${userId}`,
            type: 'mention',
            message: `${comment.author.name} mentioned you in a comment`,
            read: false,
            createdAt: new Date().toISOString(),
            postId: comment.postId,
            fromUser: comment.author.name,
          });
        });
      }
    },
    // User Preferences
    updateUserPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.currentUser) {
        state.currentUser.preferences = {
          ...state.currentUser.preferences,
          ...action.payload,
        };
        saveToLocalStorage(state);
      }
    },
    setReadingSpeed: (state, action: PayloadAction<number>) => {
      if (state.currentUser) {
        state.currentUser.readingSpeed = action.payload;
        saveToLocalStorage(state);
      }
    },
  },
});

// Helper function to save state to localStorage
const saveToLocalStorage = (state: BlogState) => {
  try {
    const stateToSave = {
      user: state.user,
      currentUser: state.currentUser,
      isAuthenticated: state.isAuthenticated,
    };
    localStorage.setItem('blog-state', JSON.stringify(stateToSave));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
};

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedTag,
  toggleBookmark,
  togglePostLike,
  toggleCommentLike,
  addComment,
  addReply,
  addToReadingHistory,
  incrementPostViews,
  subscribeToNewsletter,
  loginUser,
  logoutUser,
  updateUserProfile,
  addPost,
  updatePost,
  deletePost,
  saveDraft,
  deleteDraft,
  toggleFollowAuthor,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearReadingHistory,
  // UI State Actions
  setModalState,
  setLoadingState,
  setReadingProgress,
  // Enhanced Features
  updatePostSummary,
  updatePostDifficulty,
  addMention,
  updateUserPreferences,
  setReadingSpeed,
} = blogSlice.actions;

export default blogSlice.reducer;
