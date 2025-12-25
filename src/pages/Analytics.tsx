import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReadingAnalytics from '@/components/ReadingAnalytics';
import AIRecommendations from '@/components/AIRecommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Sparkles } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Your Reading Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Track your reading habits and discover new articles with AI-powered insights
              </p>
            </div>

            <Tabs defaultValue="analytics" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Reading Analytics
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Recommendations
                </TabsTrigger>
              </TabsList>

              <TabsContent value="analytics" className="space-y-6">
                <ReadingAnalytics />
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-6">
                <AIRecommendations />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;