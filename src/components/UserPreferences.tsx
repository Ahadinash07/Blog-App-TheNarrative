import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setReadingSpeed, updateUserPreferences } from '@/store/blogSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, BookOpen, Bell, Palette, Moon, Sun, Monitor, Type, Eye, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserPreferences = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const user = useAppSelector((state) => state.blog.currentUser);
  const [readingSpeed, setLocalReadingSpeed] = useState(user?.readingSpeed || 200);

  // Appearance settings
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Reading preferences
  const [autoScroll, setAutoScroll] = useState(false);
  const [showProgress, setShowProgress] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [nightMode, setNightMode] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    const savedAppearance = localStorage.getItem('appearance-settings');
    if (savedAppearance) {
      const appearance = JSON.parse(savedAppearance);
      setTheme(appearance.theme || 'system');
      setFontSize(appearance.fontSize || 'medium');
      setFontFamily(appearance.fontFamily || 'sans');
      setReducedMotion(appearance.reducedMotion || false);
      setHighContrast(appearance.highContrast || false);
    }

    const savedReading = localStorage.getItem('reading-preferences');
    if (savedReading) {
      const reading = JSON.parse(savedReading);
      setAutoScroll(reading.autoScroll || false);
      setShowProgress(reading.showProgress !== false);
      setSoundEnabled(reading.soundEnabled || false);
      setNightMode(reading.nightMode || false);
    }
  }, []);

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

  const saveAppearanceSettings = () => {
    const appearanceSettings = {
      theme,
      fontSize,
      fontFamily,
      reducedMotion,
      highContrast,
    };
    localStorage.setItem('appearance-settings', JSON.stringify(appearanceSettings));

    toast({
      title: 'Appearance settings saved',
      description: 'Your display preferences have been updated.',
    });
  };

  const saveReadingPreferences = () => {
    const readingPreferences = {
      autoScroll,
      showProgress,
      soundEnabled,
      nightMode,
    };
    localStorage.setItem('reading-preferences', JSON.stringify({
      ...JSON.parse(localStorage.getItem('reading-preferences') || '{}'),
      ...readingPreferences
    }));

    toast({
      title: 'Reading preferences saved',
      description: 'Your reading settings have been updated.',
    });
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
    <div className="space-y-6">
      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-all ${
                  theme === 'light' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                }`}
              >
                <Sun className="h-6 w-6" />
                <span className="text-sm">Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-all ${
                  theme === 'dark' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                }`}
              >
                <Moon className="h-6 w-6" />
                <span className="text-sm">Dark</span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-all ${
                  theme === 'system' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                }`}
              >
                <Monitor className="h-6 w-6" />
                <span className="text-sm">System</span>
              </button>
            </div>
          </div>

          <Separator />

          {/* Font Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select value={fontSize} onValueChange={(value: 'small' | 'medium' | 'large') => setFontSize(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select value={fontFamily} onValueChange={(value: 'sans' | 'serif' | 'mono') => setFontFamily(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans">Sans Serif</SelectItem>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="mono">Monospace</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Accessibility */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reduced Motion</Label>
                <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
              </div>
              <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High Contrast</Label>
                <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
              </div>
              <Switch checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
          </div>

          <Button onClick={saveAppearanceSettings} className="w-full">
            Save Appearance Settings
          </Button>
        </CardContent>
      </Card>

      {/* Reading Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Reading Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reading Speed */}
          <div className="space-y-3">
            <Label>Reading Speed (words per minute)</Label>
            <div className="space-y-2">
              <Input
                type="range"
                min="100"
                max="400"
                value={readingSpeed}
                onChange={(e) => handleReadingSpeedChange(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Slow (100)</span>
                <Badge variant="secondary">{readingSpeed} wpm</Badge>
                <span>Fast (400)</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reading Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Show Reading Progress
                </Label>
                <p className="text-sm text-muted-foreground">Display progress bar while reading</p>
              </div>
              <Switch checked={showProgress} onCheckedChange={setShowProgress} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  Sound Effects
                </Label>
                <p className="text-sm text-muted-foreground">Play sounds for page turns and completion</p>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Night Reading Mode
                </Label>
                <p className="text-sm text-muted-foreground">Optimized theme for nighttime reading</p>
              </div>
              <Switch checked={nightMode} onCheckedChange={setNightMode} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-scroll</Label>
                <p className="text-sm text-muted-foreground">Automatically scroll content at reading speed</p>
              </div>
              <Switch checked={autoScroll} onCheckedChange={setAutoScroll} />
            </div>
          </div>

          <Button onClick={saveReadingPreferences} className="w-full">
            Save Reading Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              checked={user.preferences?.notifications?.email || false}
              onCheckedChange={(checked) => handleNotificationChange('email', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive browser notifications</p>
            </div>
            <Switch
              checked={user.preferences?.notifications?.push || false}
              onCheckedChange={(checked) => handleNotificationChange('push', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reading Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded to read daily</p>
            </div>
            <Switch
              checked={user.preferences?.notifications?.reminders || false}
              onCheckedChange={(checked) => handleNotificationChange('reminders', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPreferences;