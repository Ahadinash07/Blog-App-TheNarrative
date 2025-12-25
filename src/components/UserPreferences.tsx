import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setReadingSpeed, updateUserPreferences } from '@/store/blogSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, BookOpen, Bell } from 'lucide-react';

const UserPreferences = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.blog.currentUser);
  const [readingSpeed, setLocalReadingSpeed] = useState(user?.readingSpeed || 200);

  const handleReadingSpeedChange = (speed: number) => {
    setLocalReadingSpeed(speed);
    dispatch(setReadingSpeed(speed));
  };

  const handleNotificationChange = (type: keyof NonNullable<typeof user>['preferences']['notifications'], value: boolean) => {
    if (user) {
      dispatch(updateUserPreferences({
        notifications: {
          ...user.preferences?.notifications,
          [type]: value
        }
      }));
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to access preferences.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          User Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Reading Speed */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <Label className="text-base font-medium">Reading Speed</Label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Label htmlFor="reading-speed" className="text-sm">
                Words per minute: {readingSpeed}
              </Label>
              <Input
                id="reading-speed"
                type="range"
                min="100"
                max="400"
                value={readingSpeed}
                onChange={(e) => handleReadingSpeedChange(Number(e.target.value))}
                className="w-32"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Adjust this based on your reading speed. This affects reading time estimates.
            </p>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <Label className="text-base font-medium">Notifications</Label>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="likes-notif" className="text-sm">Likes on my posts</Label>
              <Switch
                id="likes-notif"
                checked={user.preferences?.notifications.likes ?? true}
                onCheckedChange={(checked) => handleNotificationChange('likes', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="comments-notif" className="text-sm">Comments on my posts</Label>
              <Switch
                id="comments-notif"
                checked={user.preferences?.notifications.comments ?? true}
                onCheckedChange={(checked) => handleNotificationChange('comments', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="follows-notif" className="text-sm">New followers</Label>
              <Switch
                id="follows-notif"
                checked={user.preferences?.notifications.follows ?? true}
                onCheckedChange={(checked) => handleNotificationChange('follows', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="mentions-notif" className="text-sm">@Mentions</Label>
              <Switch
                id="mentions-notif"
                checked={user.preferences?.notifications.mentions ?? true}
                onCheckedChange={(checked) => handleNotificationChange('mentions', checked)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPreferences;