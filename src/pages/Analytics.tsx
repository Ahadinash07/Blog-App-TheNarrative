import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReadingAnalytics from '@/components/ReadingAnalytics';
import AIRecommendations from '@/components/AIRecommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Sparkles, TrendingUp, Eye, Heart, Share2, Clock, Target, Award, BookOpen } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDataLoading, setIsDataLoading] = useState(true);

  const user = useAppSelector((state) => state.blog.currentUser);
  const posts = useAppSelector((state) => state.blog.posts);
  const readingHistory = useAppSelector((state) => state.blog.user?.readingHistory || []);

  // Simulate loading delay ya real data aane ka wait
  useEffect(() => {
    // Agar user aur posts dono available hain toh loading false kar do
    if (user !== undefined && posts !== undefined) {
      setIsDataLoading(false);
    }

    // Optional: Agar bahut der tak data nahi aaya toh bhi loading band kar do (fallback ke liye)
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 5000); // 5 seconds ke baad force stop loader

    return () => clearTimeout(timer);
  }, [user, posts]);

  // Mock stats jab tak real data na aaye (testing ke liye - production mein hata dena)
  const overviewStats = {
    totalViews: posts?.reduce((sum, post) => sum + (post.views || 0), 0) ?? 8500,
    totalLikes: posts?.reduce((sum, post) => sum + (post.likes || 0), 0) ?? 1200,
    totalShares: posts?.reduce((sum, post) => sum + (post.shares || 0), 0) ?? 350,
    readingStreak: 7,
    weeklyGoal: 10,
    weeklyProgress: 7,
  };

  const progressPercentage = overviewStats.weeklyGoal > 0
    ? Math.min((overviewStats.weeklyProgress / overviewStats.weeklyGoal) * 100, 100)
    : 0;

  // Agar real data nahi hai toh bhi UI dikhao, bas message dikha do
  const hasNoData = (!posts || posts.length === 0) && (!readingHistory || readingHistory.length === 0);

  if (isDataLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container py-12">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    Analytics & Insights
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground">
                  Loading your analytics data...
                </p>
              </div>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Analytics & Insights
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Track your reading journey, discover insights, and get personalized recommendations
              </p>

              {/* Agar data nahi hai toh message dikhao */}
              {hasNoData && (
                <div className="mt-6 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    <strong>No reading data yet!</strong> Start reading articles to see your analytics here.
                  </p>
                </div>
              )}
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{overviewStats.totalViews.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold">{overviewStats.totalLikes.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Likes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{overviewStats.totalShares.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Shares</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{overviewStats.readingStreak}</p>
                      <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Reading Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {overviewStats.weeklyProgress} / {overviewStats.weeklyGoal} articles
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {overviewStats.weeklyGoal - overviewStats.weeklyProgress > 0
                      ? `${overviewStats.weeklyGoal - overviewStats.weeklyProgress} more articles to reach your goal!`
                      : "Goal achieved! 🎉"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Recommendations</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Insights</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Same as before... (baaki content same rakha hai) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reading Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Articles Read Today</span>
                        <Badge variant="secondary">3</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Reading Time Today</span>
                        <Badge variant="secondary">45 min</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Session</span>
                        <Badge variant="secondary">15 min</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Most Active Hour</span>
                        <Badge variant="secondary">2:00 PM</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Content Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Favorite Category</span>
                        <Badge>Technology</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Preferred Length</span>
                        <Badge>Medium (5-10 min)</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Reading Speed</span>
                        <Badge>Normal</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Night Reader</span>
                        <Badge variant="outline">Yes</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                          <Award className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium">Reading Streak Master</p>
                          <p className="text-sm text-muted-foreground">7-day reading streak achieved!</p>
                        </div>
                        <Badge className="ml-auto">New</Badge>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Knowledge Seeker</p>
                          <p className="text-sm text-muted-foreground">Read 50 articles this month</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Time Well Spent</p>
                          <p className="text-sm text-muted-foreground">10+ hours of quality reading</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <ReadingAnalytics />
              </TabsContent>

              <TabsContent value="recommendations">
                <AIRecommendations />
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                {/* Baaki insights content same */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle>Reading Patterns</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span>Morning Reader (6AM-12PM)</span><span>35%</span></div>
                        <Progress value={35} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span>Afternoon Reader (12PM-6PM)</span><span>45%</span></div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span>Evening Reader (6PM-12AM)</span><span>20%</span></div>
                        <Progress value={20} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Content Engagement</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span>Articles Completed</span><span>78%</span></div>
                        <Progress value={78} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span>Bookmarks Added</span><span>23%</span></div>
                        <Progress value={23} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span>Shared Articles</span><span>12%</span></div>
                        <Progress value={12} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader><CardTitle>Personalized Tips</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">🎯 Goal Setting</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          You're 3 articles away from your weekly goal.
                        </p>
                        <Button size="sm" variant="outline">Adjust Goal</Button>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">📚 Reading Habits</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Your most productive time is 2-3 PM.
                        </p>
                        <Button size="sm" variant="outline">Set Reminder</Button>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">🌟 Content Discovery</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          New articles in Technology & Science waiting for you.
                        </p>
                        <Button size="sm" variant="outline">View Recommendations</Button>
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
  );
};

export default Analytics;