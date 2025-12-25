import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotificationSettings from '@/components/NotificationSettings';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Settings as SettingsIcon, Bell, Crown, User, Palette, Shield, BookOpen, Globe, Download, Trash2, Save, CreditCard, Check, Star, Zap, Upload } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const user = useAppSelector((state) => state.blog.user);
  const currentUser = useAppSelector((state) => state.blog.currentUser);
  const posts = useAppSelector((state) => state.blog.posts);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
    website: currentUser?.website || '',
    location: currentUser?.location || '',
    avatar: currentUser?.avatar || '',
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

  // Premium plan selection
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  // Calculate reading time
  const totalReadingTime = user?.readingHistory?.reduce((sum: number, postId: string) => {
    const post = posts?.find(p => p.id === postId);
    return sum + (post?.readingTime || 0);
  }, 0) || 0;

  // Save profile
  const saveProfile = () => {
    const currentUserData = JSON.parse(localStorage.getItem('blog-state') || '{}');
    const updatedUserData = {
      ...currentUserData,
      currentUser: {
        ...currentUserData.currentUser,
        ...profileData,
      }
    };
    localStorage.setItem('blog-state', JSON.stringify(updatedUserData));

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
      readingHistory: user?.readingHistory || [],
      bookmarks: user?.bookmarkedPosts || [],
      preferences: { readingPrefs, privacySettings },
      appearance: JSON.parse(localStorage.getItem('appearance-settings') || '{}'),
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `narrative-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Data exported',
      description: 'Your complete data backup has been downloaded.',
    });
  };

  // Import data
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (data.version !== '1.0') {
          toast({
            title: 'Import failed',
            description: 'This backup file is not compatible.',
            variant: 'destructive',
          });
          return;
        }

        // Import profile data
        if (data.profile) {
          setProfileData(data.profile);
        }

        // Import preferences
        if (data.preferences) {
          if (data.preferences.readingPrefs) {
            setReadingPrefs(data.preferences.readingPrefs);
            localStorage.setItem('reading-preferences', JSON.stringify(data.preferences.readingPrefs));
          }
          if (data.preferences.privacySettings) {
            setPrivacySettings(data.preferences.privacySettings);
            localStorage.setItem('privacy-settings', JSON.stringify(data.preferences.privacySettings));
          }
        }

        // Import appearance settings
        if (data.appearance) {
          localStorage.setItem('appearance-settings', JSON.stringify(data.appearance));
        }

        toast({
          title: 'Data imported',
          description: 'Your settings have been restored successfully.',
        });
      } catch (error) {
        toast({
          title: 'Import failed',
          description: 'Invalid backup file format.',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  // Clear all data
  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
      toast({
        title: 'Data cleared',
        description: 'All your data has been removed.',
      });
    }
  };

  // Handle premium subscription
  const handleSubscription = async () => {
    if (!selectedPlan) {
      toast({
        title: 'Select a plan',
        description: 'Please select a premium plan to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessingPayment(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      toast({
        title: 'Payment successful!',
        description: `Welcome to ${selectedPlan} plan! Your premium features are now active.`,
      });

      // Update user premium status (simulated)
      const currentUserData = JSON.parse(localStorage.getItem('blog-state') || '{}');
      const updatedUserData = {
        ...currentUserData,
        currentUser: {
          ...currentUserData.currentUser,
          premiumPlan: selectedPlan,
          premiumSince: new Date().toISOString(),
        }
      };
      localStorage.setItem('blog-state', JSON.stringify(updatedUserData));
    }, 2000);
  };

  const premiumPlans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 9.99,
      period: 'month',
      features: [
        'Ad-free reading experience',
        'Unlimited bookmarks',
        'Advanced analytics',
        'Priority support',
        'Custom themes'
      ],
      popular: false,
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 99.99,
      period: 'year',
      originalPrice: 119.88,
      features: [
        'All Monthly features',
        '2 months free',
        'Early access to new features',
        'Exclusive content',
        'Advanced customization'
      ],
      popular: true,
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: 299.99,
      period: 'one-time',
      features: [
        'All Yearly features',
        'Lifetime access',
        'VIP support',
        'Custom integrations',
        'Remove branding'
      ],
      popular: false,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Settings - TheNarrative</title>
        <meta name="description" content="Manage your account settings, preferences, and premium subscription." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container py-12">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <SettingsIcon className="h-6 w-6 text-primary" />
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
                <TabsList className="grid w-full grid-cols-7">
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
                  <TabsTrigger value="premium" className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    <span className="hidden sm:inline">Premium</span>
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

                  {/* Statistics Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Statistics</CardTitle>
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
                            {totalReadingTime}m
                          </div>
                          <div className="text-sm text-muted-foreground">Reading Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {currentUser?.createdAt ? new Date(currentUser.createdAt).getFullYear() : new Date().getFullYear()}
                          </div>
                          <div className="text-sm text-muted-foreground">Member Since</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Reading Preferences Tab */}
                <TabsContent value="reading" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reading Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
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

                          <div className="space-y-2">
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

                          <div className="space-y-2">
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
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Reading Speed</Label>
                            <Select value={readingPrefs.readingSpeed} onValueChange={(value) => setReadingPrefs(prev => ({ ...prev, readingSpeed: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="slow">Slow (200 wpm)</SelectItem>
                                <SelectItem value="normal">Normal (250 wpm)</SelectItem>
                                <SelectItem value="fast">Fast (300 wpm)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Auto-save Progress</Label>
                              <p className="text-sm text-muted-foreground">Automatically save your reading progress</p>
                            </div>
                            <Switch
                              checked={readingPrefs.autoSaveProgress}
                              onCheckedChange={(checked) => setReadingPrefs(prev => ({ ...prev, autoSaveProgress: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Show Reading Time</Label>
                              <p className="text-sm text-muted-foreground">Display estimated reading time for articles</p>
                            </div>
                            <Switch
                              checked={readingPrefs.showReadingTime}
                              onCheckedChange={(checked) => setReadingPrefs(prev => ({ ...prev, showReadingTime: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Highlight on Scroll</Label>
                              <p className="text-sm text-muted-foreground">Highlight text as you scroll</p>
                            </div>
                            <Switch
                              checked={readingPrefs.highlightOnScroll}
                              onCheckedChange={(checked) => setReadingPrefs(prev => ({ ...prev, highlightOnScroll: checked }))}
                            />
                          </div>
                        </div>
                      </div>

                      <Button onClick={saveReadingPrefs} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Preferences
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

                {/* Premium Tab */}
                <TabsContent value="premium" className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">Upgrade to Premium</h2>
                    <p className="text-muted-foreground">Unlock advanced features and enhance your reading experience</p>
                  </div>

                  {/* Current Plan Status */}
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Current Plan</h3>
                          <p className="text-sm text-muted-foreground">
                            {currentUser?.premiumPlan ? `${currentUser.premiumPlan} Plan` : 'Free Plan'}
                          </p>
                        </div>
                        <Badge variant={currentUser?.premiumPlan ? "default" : "secondary"}>
                          {currentUser?.premiumPlan ? 'Active' : 'Free'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Premium Plans */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {premiumPlans.map((plan) => (
                      <Card
                        key={plan.id}
                        className={`relative cursor-pointer transition-all ${
                          selectedPlan === plan.id
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'hover:border-primary/50'
                        } ${plan.popular ? 'border-primary' : ''}`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                          </div>
                        )}
                        <CardHeader className="text-center">
                          <CardTitle className="flex items-center justify-center gap-2">
                            <Crown className="h-5 w-5 text-primary" />
                            {plan.name}
                          </CardTitle>
                          <div className="text-3xl font-bold">
                            ${plan.price}
                            <span className="text-sm font-normal text-muted-foreground">
                              /{plan.period}
                            </span>
                          </div>
                          {plan.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              ${plan.originalPrice}/{plan.period}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Payment Section */}
                  {selectedPlan && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Complete Your Purchase</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div>
                            <h4 className="font-semibold">
                              {premiumPlans.find(p => p.id === selectedPlan)?.name} Plan
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              ${premiumPlans.find(p => p.id === selectedPlan)?.price}/
                              {premiumPlans.find(p => p.id === selectedPlan)?.period}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              ${premiumPlans.find(p => p.id === selectedPlan)?.price}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Label>Payment Method</Label>
                          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="card" id="card" />
                              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                                <CreditCard className="h-4 w-4" />
                                Credit/Debit Card
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="paypal" id="paypal" />
                              <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                                <Globe className="h-4 w-4" />
                                PayPal
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {paymentMethod === 'card' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                maxLength={5}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                maxLength={4}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="name">Cardholder Name</Label>
                              <Input
                                id="name"
                                placeholder="John Doe"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="terms" className="rounded" />
                          <Label htmlFor="terms" className="text-sm">
                            I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                          </Label>
                        </div>

                        <Button
                          onClick={handleSubscription}
                          disabled={isProcessingPayment}
                          className="w-full gap-2"
                          size="lg"
                        >
                          {isProcessingPayment ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Processing Payment...
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4" />
                              Subscribe Now - ${premiumPlans.find(p => p.id === selectedPlan)?.price}
                            </>
                          )}
                        </Button>

                        <p className="text-xs text-muted-foreground text-center">
                          Your payment information is secure and encrypted. You can cancel anytime.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Profile Visibility</Label>
                            <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                          </div>
                          <Select value={privacySettings.profileVisibility} onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Show Reading Activity</Label>
                            <p className="text-sm text-muted-foreground">Allow others to see your reading activity</p>
                          </div>
                          <Switch
                            checked={privacySettings.showReadingActivity}
                            onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showReadingActivity: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Show Bookmarks</Label>
                            <p className="text-sm text-muted-foreground">Make your bookmarks visible to others</p>
                          </div>
                          <Switch
                            checked={privacySettings.showBookmarks}
                            onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, showBookmarks: checked }))}
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Analytics</Label>
                            <p className="text-sm text-muted-foreground">Help improve the platform with usage data</p>
                          </div>
                          <Switch
                            checked={privacySettings.allowAnalytics}
                            onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, allowAnalytics: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Marketing</Label>
                            <p className="text-sm text-muted-foreground">Receive promotional emails and newsletters</p>
                          </div>
                          <Switch
                            checked={privacySettings.emailMarketing}
                            onCheckedChange={(checked) => setPrivacySettings(prev => ({ ...prev, emailMarketing: checked }))}
                          />
                        </div>
                      </div>

                      <Button onClick={savePrivacySettings} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Privacy Settings
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">Export Your Data</h4>
                            <p className="text-sm text-muted-foreground">
                              Download a complete backup of your profile, preferences, and reading data
                            </p>
                          </div>
                          <Button variant="outline" onClick={exportData} className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Backup
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-semibold">Import Data</h4>
                            <p className="text-sm text-muted-foreground">
                              Restore your settings and preferences from a backup file
                            </p>
                          </div>
                          <div>
                            <input
                              type="file"
                              accept=".json"
                              onChange={importData}
                              className="hidden"
                              id="import-file"
                            />
                            <Button
                              variant="outline"
                              onClick={() => document.getElementById('import-file')?.click()}
                              className="gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              Import Backup
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
                          <div>
                            <h4 className="font-semibold text-red-700 dark:text-red-400">Danger Zone</h4>
                            <p className="text-sm text-red-600 dark:text-red-300">
                              Permanently delete all your data. This action cannot be undone.
                            </p>
                          </div>
                          <Button variant="destructive" onClick={clearAllData} className="gap-2">
                            <Trash2 className="h-4 w-4" />
                            Clear All Data
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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

export default Settings;