import { store } from '../store';
import { addNotification } from '../store/blogSlice';

class PushNotificationManager {
  private static instance: PushNotificationManager;
  private swRegistration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): PushNotificationManager {
    if (!PushNotificationManager.instance) {
      PushNotificationManager.instance = new PushNotificationManager();
    }
    return PushNotificationManager.instance;
  }

  async initialize() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        this.swRegistration = await navigator.serviceWorker.ready;
        console.log('Push notifications supported');
      } catch (error) {
        console.error('Service worker not ready for push:', error);
      }
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      console.error('Service worker not initialized');
      return null;
    }

    try {
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'BYourVAPKeyHere' // In production, this would come from your server
        )
      });

      console.log('Push subscription successful:', subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.swRegistration) return false;

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        const result = await subscription.unsubscribe();
        console.log('Push unsubscribed successfully');
        return result;
      }
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  async sendTestNotification() {
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const notification = new Notification('Test Notification', {
      body: 'This is a test push notification from Redux Magic Blog!',
      icon: '/placeholder.svg',
      badge: '/placeholder.svg',
      tag: 'test-notification'
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Also add to in-app notifications
    store.dispatch(addNotification({
      id: `test-${Date.now()}`,
      type: 'comment',
      message: 'Test notification sent successfully!',
      read: false,
      createdAt: new Date().toISOString(),
    }));
  }

  getSubscription(): Promise<PushSubscription | null> {
    if (!this.swRegistration) return Promise.resolve(null);
    return this.swRegistration.pushManager.getSubscription();
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const pushNotificationManager = PushNotificationManager.getInstance();