import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotificationSettings from '@/components/NotificationSettings';
import { MonetizationDashboard } from '@/components/MonetizationDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Bell, Crown, User, Palette } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Settings & Preferences
              </h1>
              <p className="text-lg text-muted-foreground">
                Customize your experience and manage your account
              </p>
            </div>

            <Tabs defaultValue="notifications" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="monetization" className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Premium
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="account" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notifications" className="space-y-6">
                <NotificationSettings />
              </TabsContent>

              <TabsContent value="monetization" className="space-y-6">
                <MonetizationDashboard />
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Theme Preferences</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose how the app looks and feels
                    </p>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Reading Experience</h3>
                    <p className="text-sm text-muted-foreground">
                      Customize your reading preferences
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Profile Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Update your personal information
                    </p>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Privacy & Security</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your privacy settings
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SettingsPage;