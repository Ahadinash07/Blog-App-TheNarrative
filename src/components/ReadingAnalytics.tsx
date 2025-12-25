import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, TrendingUp, Target, Calendar, Award, Download, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';

const ReadingAnalytics = () => {
  const user = useAppSelector((state) => state.blog.currentUser);
  const posts = useAppSelector((state) => state.blog.posts);
  const readingHistory = useAppSelector((state) => state.blog.user.readingHistory);

  const analytics = useMemo(() => {
    if (!user || !readingHistory.length) {
      return {
        totalArticles: 0,
        totalReadingTime: 0,
        averageReadingTime: 0,
        favoriteCategory: '',
        readingStreak: 0,
        weeklyGoal: 5,
        weeklyProgress: 0,
        topTags: [],
        readingSpeed: user?.readingSpeed || 200,
      };
    }

    const readPosts = posts.filter(post => readingHistory.includes(post.id));
    const totalReadingTime = readPosts.reduce((sum, post) => sum + (post.readingTime || 5), 0);

    // Calculate favorite category
    const categoryCount = readPosts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const favoriteCategory = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    // Calculate top tags
    const tagCount = readPosts.reduce((acc, post) => {
      post.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    const topTags = Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag);

    // Calculate reading streak (simplified - consecutive days)
    const readingStreak = 3; // Mock data for now

    // Weekly progress
    const weeklyGoal = 5;
    const weeklyProgress = Math.min(readPosts.length, weeklyGoal);

    return {
      totalArticles: readPosts.length,
      totalReadingTime,
      averageReadingTime: Math.round(totalReadingTime / readPosts.length),
      favoriteCategory,
      readingStreak,
      weeklyGoal,
      weeklyProgress,
      topTags,
      readingSpeed: user.readingSpeed || 200,
    };
  }, [user, posts, readingHistory]);

  const chartData = useMemo(() => {
    if (!user || !readingHistory.length) {
      return {
        readingActivity: [],
        categoryDistribution: [],
        readingTimeTrend: [],
      };
    }

    const readPosts = posts.filter(post => readingHistory.includes(post.id));

    // Reading activity over last 7 days
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date()
    });

    const readingActivity = last7Days.map(date => {
      const dayPosts = readPosts.filter(post => {
        // Mock date logic - in real app, use actual read dates
        const postIndex = readingHistory.indexOf(post.id);
        const daysAgo = Math.floor(postIndex / 2); // Mock distribution
        return daysAgo <= 6 - last7Days.indexOf(date);
      });

      return {
        date: format(date, 'MMM dd'),
        articles: dayPosts.length,
        readingTime: dayPosts.reduce((sum, post) => sum + (post.readingTime || 5), 0),
      };
    });

    // Category distribution
    const categoryCount = readPosts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryDistribution = Object.entries(categoryCount).map(([category, count]) => ({
      name: category,
      value: count,
      percentage: Math.round((count / readPosts.length) * 100),
    }));

    // Reading time trend (mock data)
    const readingTimeTrend = last7Days.map((date, index) => ({
      date: format(date, 'MMM dd'),
      minutes: Math.floor(Math.random() * 60) + 20, // Mock data
    }));

    return {
      readingActivity,
      categoryDistribution,
      readingTimeTrend,
    };
  }, [user, posts, readingHistory]);

  const exportAnalytics = () => {
    const data = {
      analytics,
      chartData,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reading-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please log in to view your reading analytics.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalArticles}</p>
                <p className="text-sm text-muted-foreground">Articles Read</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalReadingTime}m</p>
                <p className="text-sm text-muted-foreground">Total Reading Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{analytics.averageReadingTime}m</p>
                <p className="text-sm text-muted-foreground">Avg. per Article</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{analytics.readingStreak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Weekly Reading Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{analytics.weeklyProgress} / {analytics.weeklyGoal} articles</span>
            </div>
            <Progress value={(analytics.weeklyProgress / analytics.weeklyGoal) * 100} />
            <p className="text-xs text-muted-foreground">
              {analytics.weeklyGoal - analytics.weeklyProgress} more articles to reach your weekly goal!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reading Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reading Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Reading Speed</p>
              <p className="text-2xl font-bold text-primary">{analytics.readingSpeed} WPM</p>
              <p className="text-xs text-muted-foreground">Words per minute</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Favorite Category</p>
              <Badge variant="secondary" className="text-sm">
                {analytics.favoriteCategory || 'None yet'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Top Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analytics.topTags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
            {analytics.topTags.length === 0 && (
              <p className="text-sm text-muted-foreground">Start reading to see your interests!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reading Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reading Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {readingHistory.slice(0, 5).map((postId) => {
              const post = posts.find(p => p.id === postId);
              return post ? (
                <div key={postId} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.category}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {post.readingTime}m
                  </Badge>
                </div>
              ) : null;
            })}
            {readingHistory.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No reading history yet. Start reading some articles!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reading Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Reading Activity (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.readingActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="articles" fill="#FF6B35" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reading Time Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Reading Time Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.readingTimeTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="minutes" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Export Button */}
      <div className="flex justify-center">
        <Button onClick={exportAnalytics} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Analytics Data
        </Button>
      </div>
    </div>
  );
};

export default ReadingAnalytics;