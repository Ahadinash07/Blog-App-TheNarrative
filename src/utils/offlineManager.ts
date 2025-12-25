import { store } from '../store';

interface OfflineAction {
  type: string;
  payload?: unknown;
  timestamp: number;
  id: string;
}

interface UserData {
  [key: string]: unknown;
}

interface CacheStatus {
  articles: number;
  userData: boolean;
  lastSync: number;
}

class OfflineManager {
  private static instance: OfflineManager;
  private offlineActions: OfflineAction[] = [];
  private isOnline: boolean = navigator.onLine;

  private constructor() {
    this.setupEventListeners();
    this.loadOfflineActions();
  }

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineActions();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private async loadOfflineActions() {
    try {
      const cache = await caches.open('blog-dynamic-v1');
      const response = await cache.match('/offline-actions');
      if (response) {
        this.offlineActions = await response.json();
      }
    } catch (error) {
      console.error('Failed to load offline actions:', error);
    }
  }

  private async saveOfflineActions() {
    try {
      const cache = await caches.open('blog-dynamic-v1');
      const response = new Response(JSON.stringify(this.offlineActions), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cache.put('/offline-actions', response);
    } catch (error) {
      console.error('Failed to save offline actions:', error);
    }
  }

  async queueOfflineAction(action: Omit<OfflineAction, 'timestamp' | 'id'>) {
    this.offlineActions.push({
      ...action,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9)
    });

    await this.saveOfflineActions();

    if (this.isOnline) {
      this.syncOfflineActions();
    }
  }

  private async syncOfflineActions() {
    if (!this.isOnline || this.offlineActions.length === 0) return;

    try {
      // Register background sync
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync');
      }
    } catch (error) {
      console.error('Failed to register background sync:', error);
    }
  }

  async cacheArticle(url: string) {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({
        type: 'CACHE_ARTICLE',
        url
      });
    }
  }

  async cacheUserData(data: UserData) {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({
        type: 'CACHE_USER_DATA',
        data
      });
    }
  }

  async getCacheStatus(): Promise<CacheStatus> {
    return new Promise((resolve) => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'CACHE_STATUS') {
            resolve(event.data.status);
          }
        });

        navigator.serviceWorker.ready.then((registration) => {
          registration.active?.postMessage({
            type: 'GET_CACHE_STATUS'
          });
        });
      } else {
        resolve({});
      }
    });
  }

  getOfflineActions() {
    return [...this.offlineActions];
  }

  clearOfflineActions() {
    this.offlineActions = [];
    this.saveOfflineActions();
  }

  isOffline() {
    return !this.isOnline;
  }
}

export const offlineManager = OfflineManager.getInstance();