import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotificationSettings from '@/components/NotificationSettings';
import { MonetizationDashboard } from '@/components/MonetizationDashboard';
import UserPreferences from '@/components/UserPreferences';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, Bell, Crown, User, Palette, Shield, BookOpen, Globe, Download, Trash2, Save } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useToast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const user = useAppSelector((state) => state.blog.user);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    bio: user.bio || '',
    website: user.website || '',
    location: user.location || '',
    avatar: user.avatar || '',
  });

  // Reading preferences
  const [readingPrefs, setReadingPrefs] = useState({
    fontSize: 'medium',
    lineHeight: 'normal',
    fontFamily: 'system',
    readingSpeed: 'normal',
    autoSaveProgress: true,
    showReadingTime: true,
    highlightOnScroll: false,
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showReadingActivity: true,
    showBookmarks: false,
    allowAnalytics: true,
    emailMarketing: false,
    dataExport: false,
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('reading-preferences');
    if (savedPrefs) {
      setReadingPrefs(JSON.parse(savedPrefs));
    }

    const savedPrivacy = localStorage.getItem('privacy-settings');
    if (savedPrivacy) {
      setPrivacySettings(JSON.parse(savedPrivacy));
    }
  }, []);

  // Save profile
  const saveProfile = () => {
    // For now, save to localStorage directly since updateUser action doesn't exist
    const currentUserData = JSON.parse(localStorage.getItem('blog-state') || '{}');
    const updatedUserData = {
      ...currentUserData,
      user: {
        ...currentUserData.user,
        ...profileData,
      }
    };
    localStorage.setItem('blog-state', JSON.stringify(updatedUserData));

    // Also update current user if logged in
    if (user.currentUser) {
      const updatedCurrentUser = { ...user.currentUser, ...profileData };
      localStorage.setItem('blog-state', JSON.stringify({
        ...currentUserData,
        currentUser: updatedCurrentUser
      }));
    }

    toast({
      title: 'Profile updated',
      description: 'Your profile information has been saved.',
    });
  };

  // Save reading preferences
  const saveReadingPrefs = () => {
    localStorage.setItem('reading-preferences', JSON.stringify(readingPrefs));
    toast({
      title: 'Reading preferences saved',
      description: 'Your reading preferences have been updated.',
    });
  };

  // Save privacy settings
  const savePrivacySettings = () => {
    localStorage.setItem('privacy-settings', JSON.stringify(privacySettings));
    toast({
      title: 'Privacy settings saved',
      description: 'Your privacy preferences have been updated.',
    });
  };

  // Export data
  const exportData = () => {
    const data = {
      profile: profileData,
      readingHistory: user.readingHistory,
      bookmarks: user.bookmarkedPosts,
      preferences: { readingPrefs, privacySettings },
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `narrative-data-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Data exported',
      description: 'Your data has been downloaded successfully.',
    });
  };

  // Clear all data
  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      localStorage.clear();
      dispatch(updateUser({
        name: '',
        email: '',
        bio: '',
        website: '',
        location: '',
        avatar: '',
        readingHistory: [],
        bookmarkedPosts: [],
      }));
      setProfileData({
        name: '',
        email: '',
        bio: '',
        website: '',
        location: '',
        avatar: '',
      });
      toast({
        title: 'Data cleared',
        description: 'All your data has been removed.',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings - TheNarrative</title>
        <meta name="description" content="Manage your account settings, preferences, and privacy options." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container py-12">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    Settings & Preferences
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground">
                  Customize your experience and manage your account settings
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger value="reading" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Reading</span>
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span className="hidden sm:inline">Appearance</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="hidden sm:inline">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="privacy" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Privacy</span>
                  </TabsTrigger>
                  <TabsTrigger value="account" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">Account</span>
                  </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={profileData.avatar} />
                          <AvatarFallback>{profileData.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Button variant="outline" size="sm">
                            Change Avatar
                          </Button>
                          <p className="text-sm text-muted-foreground mt-2">
                            JPG, PNG or GIF. Max size 2MB.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="your@email.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={profileData.website}
                            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={profileData.location}
                            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="City, Country"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                          rows={3}
                        />
                      </div>

                      <Button onClick={saveProfile} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Profile
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Reading Tab */}
                <TabsContent value="reading" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reading Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label>Font Size</Label>
                            <Select value={readingPrefs.fontSize} onValueChange={(value) => setReadingPrefs(prev => ({ ...prev, fontSize: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                                <SelectItem value="extra-large">Extra Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Font Family</Label>
                            <Select value={readingPrefs.fontFamily} onValueChange={(value) => setReadingPrefs(prev => ({ ...prev, fontFamily: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="system">System Default</SelectItem>
                                <SelectItem value="serif">Serif</SelectItem>
                                <SelectItem value="sans">Sans Serif</SelectItem>
                                <SelectItem value="mono">Monospace</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Reading Speed</Label>
                            <Select value={readingPrefs.readingSpeed} onValueChange={(value) => setReadingPrefs(prev => ({ ...prev, readingSpeed: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="slow">Slow</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="fast">Fast</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label>Line Height</Label>
                            <Select value={readingPrefs.lineHeight} onValueChange={(value) => setReadingPrefs(prev => ({ ...prev, lineHeight: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tight">Tight</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="relaxed">Relaxed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="auto-save">Auto-save reading progress</Label>
                              <Switch
                                id="auto-save"
                                checked={readingPrefs.autoSaveProgress}
                                onCheckedChange={(checked) => setReadingPrefs(prev => ({ ...prev, autoSaveProgress: checked }))}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <Label htmlFor="show-time">Show reading time estimates</Label>
                              <Switch
                                id="show-time"
                                checked={readingPrefs.showReadingTime}
                                onCheckedChange={(checked) => setReadingPrefs(prev => ({ ...prev, showReadingTime: checked }))}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <Label htmlFor="highlight-scroll">Highlight text on scroll</Label>
                              <Switch
                                id="highlight-scroll"
                                checked={readingPrefs.highlightOnScroll}
                                onCheckedChange={(checked) => setReadingPrefs(prev => ({ ...prev, highlightOnScroll: checked }))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button onClick={saveReadingPrefs} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Reading Preferences
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6">
                  <UserPreferences />
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                  <NotificationSettings />
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy & Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Profile Visibility</Label>
                          <Select value={privacySettings.profileVisibility} onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="friends">Friends Only</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="reading-activity">Show reading activity</Label>
                              <p className="text-sm text-muted-foreground">Let others see what you're reading</p>
                            </div>
                            <Switch
                              id="reading-activity"
                              checked={privacySettings.showReadingActivity}
                              onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showReadingActivity: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="bookmarks">Show bookmarks publicly</Label>
                              <p className="text-sm text-muted-foreground">Allow others to see your saved articles</p>
                            </div>
                            <Switch
                              id="bookmarks"
                              checked={privacySettings.showBookmarks}
                              onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showBookmarks: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="analytics">Allow analytics</Label>
                              <p className="text-sm text-muted-foreground">Help improve the app with usage data</p>
                            </div>
                            <Switch
                              id="analytics"
                              checked={privacySettings.allowAnalytics}
                              onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowAnalytics: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="marketing">Email marketing</Label>
                              <p className="text-sm text-muted-foreground">Receive updates and promotional emails</p>
                            </div>
                            <Switch
                              id="marketing"
                              checked={privacySettings.emailMarketing}
                              onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, emailMarketing: checked }))}
                            />
                          </div>
                        </div>

                        <Button onClick={savePrivacySettings} className="gap-2">
                          <Save className="h-4 w-4" />
                          Save Privacy Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Data Management</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Export Your Data</h4>
                            <p className="text-sm text-muted-foreground">Download all your data in JSON format</p>
                          </div>
                          <Button variant="outline" onClick={exportData} className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Data
                          </Button>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-destructive">Clear All Data</h4>
                            <p className="text-sm text-muted-foreground">Permanently delete all your data</p>
                          </div>
                          <Button variant="destructive" onClick={clearAllData} className="gap-2">
                            <Trash2 className="h-4 w-4" />
                            Clear Data
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Account Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{user.bookmarkedPosts?.length || 0}</div>
                            <div className="text-sm text-muted-foreground">Bookmarks</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{user.readingHistory?.length || 0}</div>
                            <div className="text-sm text-muted-foreground">Articles Read</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {user.readingHistory?.reduce((sum: number, item: any) => sum + (item.timeSpent || 0), 0) || 0}m
                            </div>
                            <div className="text-sm text-muted-foreground">Reading Time</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {new Date(user.joinDate || Date.now()).getFullYear()}
                            </div>
                            <div className="text-sm text-muted-foreground">Member Since</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SettingsPage;