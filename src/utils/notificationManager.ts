import { store } from '../store';
import { addNotification } from '../store/blogSlice';
import type { User, Post, Comment } from '../types/blog';

class NotificationManager {
  private intervalId: NodeJS.Timeout | null = null;
  private lastCheck = Date.now();

  startPolling() {
    // Check for new notifications every 30 seconds
    this.intervalId = setInterval(() => {
      this.checkForNewContent();
    }, 30000);
  }

  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private checkForNewContent() {
    const state = store.getState();
    const { currentUser, posts, comments } = state.blog;

    if (!currentUser) return;

    const now = Date.now();
    const timeDiff = now - this.lastCheck;

    // Simulate new content notifications (in a real app, this would check an API)
    if (timeDiff > 300000) { // 5 minutes
      this.simulateNotifications(currentUser, posts, comments);
      this.lastCheck = now;
    }
  }

  private simulateNotifications(user: User, posts: Post[], comments: Comment[]) {
    // Simulate different types of notifications
    const notificationTypes = [
      {
        type: 'comment' as const,
        message: 'Someone commented on your article',
        condition: () => Math.random() > 0.7, // 30% chance
      },
      {
        type: 'like' as const,
        message: 'Your article received a new like',
        condition: () => Math.random() > 0.8, // 20% chance
      },
      {
        type: 'follow' as const,
        message: 'Someone started following you',
        condition: () => Math.random() > 0.9, // 10% chance
      },
    ];

    notificationTypes.forEach(({ type, message, condition }) => {
      if (condition()) {
        store.dispatch(addNotification({
          type,
          message,
          postId: posts[Math.floor(Math.random() * posts.length)]?.id,
        }));
      }
    });
  }

  // Request permission for browser notifications
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Show browser notification
  showBrowserNotification(title: string, options?: NotificationOptions) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options,
      });
    }
  }
}

export const notificationManager = new NotificationManager();