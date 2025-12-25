import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Flame, TrendingUp, Eye, Heart, Clock, Calendar, BarChart3, Award, Zap, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import NewsletterCTA from '@/components/NewsletterCTA';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAppSelector } from '@/store/hooks';

type TimeFilter = 'all' | 'week' | 'month' | 'year';
type SortOption = 'score' | 'views' | 'likes' | 'comments';

const Popular = () => {
  const posts = useAppSelector((state) => state.blog.posts);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('score');

  // Filter posts by time
  const filteredPosts = useMemo(() => {
    const now = new Date();
    const timeFilters = {
      all: () => true,
      week: (post: Post) => {
        const postDate = new Date(post.publishedAt);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return postDate >= weekAgo;
      },
      month: (post: Post) => {
        const postDate = new Date(post.publishedAt);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return postDate >= monthAgo;
      },
      year: (post: Post) => {
        const postDate = new Date(post.publishedAt);
        const yearAgo = new Date(post.publishedAt);
        const yearAgoDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return postDate >= yearAgoDate;
      },
    };

    return posts.filter(timeFilters[timeFilter]);
  }, [posts, timeFilter]);

  // Enhanced trending algorithm
  const trending = useMemo(() => {
    return [...filteredPosts]
      .map((post) => {
        const daysSincePublished = Math.max(1, (new Date().getTime() - new Date(post.publishedAt).getTime()) / (1000 * 60 * 60 * 24));
        const recencyScore = 1 / Math.sqrt(daysSincePublished); // Recent posts get higher score
        const engagementScore = post.views * 0.3 + post.likes * 2 + post.comments * 3;
        const score = engagementScore * recencyScore;

        return { ...post, score, recencyScore, engagementScore };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [filteredPosts]);

  // Most viewed with time consideration
  const mostViewed = useMemo(() => {
    return [...filteredPosts]
      .sort((a, b) => b.views - a.views)
      .slice(0, 12);
  }, [filteredPosts]);

  // Most liked with time consideration
  const mostLiked = useMemo(() => {
    return [...filteredPosts]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 12);
  }, [filteredPosts]);

  // Most commented
  const mostCommented = useMemo(() => {
    return [...filteredPosts]
      .sort((a, b) => b.comments - a.comments)
      .slice(0, 12);
  }, [filteredPosts]);

  // Analytics data
  const analytics = useMemo(() => {
    const totalViews = filteredPosts.reduce((sum, post) => sum + post.views, 0);
    const totalLikes = filteredPosts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = filteredPosts.reduce((sum, post) => sum + post.comments, 0);
    const avgViews = filteredPosts.length > 0 ? Math.round(totalViews / filteredPosts.length) : 0;
    const avgLikes = filteredPosts.length > 0 ? Math.round(totalLikes / filteredPosts.length) : 0;
    const avgComments = filteredPosts.length > 0 ? Math.round(totalComments / filteredPosts.length) : 0;

    return {
      totalViews,
      totalLikes,
      totalComments,
      avgViews,
      avgLikes,
      avgComments,
      topCategory: getTopCategory(filteredPosts),
      engagementRate: totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100).toFixed(1) : '0',
    };
  }, [filteredPosts]);

  // Get top performing category
  function getTopCategory(posts: Post[]) {
    const categoryStats = posts.reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + post.views + post.likes * 2;
      return acc;
    }, {});

    return Object.entries(categoryStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
  }

  // Get current tab data based on sort
  const getCurrentData = (tab: string) => {
    const dataMap = {
      trending,
      views: mostViewed,
      likes: mostLiked,
      comments: mostCommented,
    };
    return dataMap[tab as keyof typeof dataMap] || trending;
  };

  return (
    <>
      <Helmet>
        <title>Popular Articles - TheNarrative</title>
        <meta name="description" content="Discover the most popular articles on TheNarrative. See what's trending and what readers love most." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="container py-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                      Popular Articles
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mt-1">
                      Discover what's capturing the attention of our community. These are the articles
                      that readers can't stop talking about.
                    </p>
                  </div>
                </div>
              </div>

              {/* Time Filter */}
              <div className="flex items-center gap-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Analytics Cards */}
          <section className="container pb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Views</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <div className="text-2xl font-bold">{analytics.totalLikes.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Likes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{analytics.engagementRate}%</div>
                  <div className="text-sm text-muted-foreground">Engagement Rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{analytics.topCategory}</div>
                  <div className="text-sm text-muted-foreground">Top Category</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Tabs Section */}
          <section className="container pb-16">
            <Tabs defaultValue="trending" className="space-y-8">
              <TabsList className="grid w-full max-w-2xl grid-cols-4">
                <TabsTrigger value="trending" className="gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">Trending</span>
                </TabsTrigger>
                <TabsTrigger value="views" className="gap-2">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Most Viewed</span>
                </TabsTrigger>
                <TabsTrigger value="likes" className="gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Most Liked</span>
                </TabsTrigger>
                <TabsTrigger value="comments" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Most Discussed</span>
                </TabsTrigger>
              </TabsList>

              {['trending', 'views', 'likes', 'comments'].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="space-y-6">
                    {/* Top 3 Featured */}
                    <div className="grid gap-6 md:grid-cols-3">
                      {getCurrentData(tab).slice(0, 3).map((post, index) => (
                        <div key={post.id} className="relative">
                          <div className="absolute -top-2 -left-2 z-10">
                            <Badge variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                              #{index + 1}
                            </Badge>
                          </div>
                          <PostCard post={post} featured />
                          {tab === 'trending' && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <TrendingUp className="h-4 w-4" />
                              <span>Score: {Math.round(post.score)}</span>
                              <Progress value={(post.score / trending[0]?.score) * 100} className="flex-1 h-2" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Rest of the list */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {getCurrentData(tab).slice(3).map((post, index) => (
                        <div
                          key={post.id}
                          className="animate-slide-up"
                          style={{ animationDelay: `${(index + 3) * 50}ms` }}
                        >
                          <PostCard post={post} />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </section>

          {/* Newsletter */}
          <section className="container pb-16">
            <NewsletterCTA />
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Popular;
