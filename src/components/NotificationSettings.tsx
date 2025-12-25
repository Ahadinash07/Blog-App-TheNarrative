import { useState, useEffect } from 'react';
import { Bell, BellOff, Smartphone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/store/hooks';
import { pushNotificationManager } from '@/utils/pushNotificationManager';
import { useToast } from '@/hooks/use-toast';

const NotificationSettings = () => {
  const user = useAppSelector((state) => state.blog.currentUser);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');
  const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    if ('Notification' in window) {
      setBrowserPermission(Notification.permission);
    }

    try {
      const subscription = await pushNotificationManager.getSubscription();
      setPushSubscription(subscription);
    } catch (error) {
      console.error('Failed to check push subscription:', error);
    }
  };

  const requestPermission = async () => {
    setIsLoading(true);
    try {
      const permission = await pushNotificationManager.requestPermission();
      setBrowserPermission(permission);

      if (permission === 'granted') {
        toast({
          title: 'Notifications enabled!',
          description: 'You will now receive push notifications.',
        });
      } else {
        toast({
          title: 'Permission denied',
          description: 'You can enable notifications in your browser settings.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to request permission:', error);
      toast({
        title: 'Error',
        description: 'Failed to request notification permission.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToPush = async () => {
    setIsLoading(true);
    try {
      const subscription = await pushNotificationManager.subscribe();
      setPushSubscription(subscription);

      if (subscription) {
        toast({
          title: 'Push notifications enabled!',
          description: 'You will receive notifications even when the app is closed.',
        });
      }
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      toast({
        title: 'Subscription failed',
        description: 'Failed to enable push notifications.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setIsLoading(true);
    try {
      const success = await pushNotificationManager.unsubscribe();
      if (success) {
        setPushSubscription(null);
        toast({
          title: 'Push notifications disabled',
          description: 'You will no longer receive push notifications.',
        });
      }
    } catch (error) {
      console.error('Failed to unsubscribe from push:', error);
      toast({
        title: 'Error',
        description: 'Failed to disable push notifications.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      await pushNotificationManager.sendTestNotification();
      toast({
        title: 'Test notification sent!',
        description: 'Check your notifications.',
      });
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test notification.',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to manage notification settings.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Browser Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <Label htmlFor="browser-notifications">Browser Notifications</Label>
                <Badge variant={
                  browserPermission === 'granted' ? 'default' :
                  browserPermission === 'denied' ? 'destructive' : 'secondary'
                }>
                  {browserPermission === 'granted' ? 'Enabled' :
                   browserPermission === 'denied' ? 'Blocked' : 'Not Set'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive notifications in your browser while using the app
              </p>
            </div>
            <div className="flex gap-2">
              {browserPermission !== 'granted' && (
                <Button
                  onClick={requestPermission}
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading ? 'Requesting...' : 'Enable'}
                </Button>
              )}
              <Button
                onClick={sendTestNotification}
                disabled={browserPermission !== 'granted' || isLoading}
                variant="outline"
                size="sm"
              >
                Test
              </Button>
            </div>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <Badge variant={pushSubscription ? 'default' : 'secondary'}>
                  {pushSubscription ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive notifications even when the app is closed
              </p>
            </div>
            <div className="flex gap-2">
              {!pushSubscription ? (
                <Button
                  onClick={subscribeToPush}
                  disabled={browserPermission !== 'granted' || isLoading}
                  size="sm"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              ) : (
                <Button
                  onClick={unsubscribeFromPush}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
                </Button>
              )}
            </div>
          </div>

          {/* In-App Notification Preferences */}
          <div className="space-y-4">
            <h4 className="font-medium">In-App Notifications</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Likes on my posts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone likes your articles</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>New comments</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone comments on your posts</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Mentions</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone mentions you</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>New followers</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone follows you</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Bell className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Welcome to Redux Magic Blog!</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="secondary">New</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg opacity-60">
              <BellOff className="h-4 w-4" />
              <div className="flex-1">
                <p className="text-sm font-medium">Your article got 5 new likes</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <Badge variant="outline">Read</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;