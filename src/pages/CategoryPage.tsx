import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { ArrowLeft, Filter, SortAsc, Calendar, Clock, TrendingUp, Grid, List } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type SortOption = 'newest' | 'oldest' | 'popular' | 'trending';
type ViewMode = 'grid' | 'list';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const posts = useAppSelector((state) => state.blog.posts);
  const categories = useAppSelector((state) => state.blog.categories);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');

  // Convert slug back to category name
  const categoryName = categories.find(
    (c) => c.toLowerCase().replace(' & ', '-') === slug
  );

  const allCategoryPosts = categoryName
    ? posts.filter((p) => p.category === categoryName)
    : [];

  // Filter by time
  const filteredPosts = useMemo(() => {
    const now = new Date();
    const timeFilters = {
      all: () => true,
      week: (date: string) => new Date(date) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      month: (date: string) => new Date(date) > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      year: (date: string) => new Date(date) > new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
    };

    return allCategoryPosts.filter(post => timeFilters[timeFilter](post.publishedAt));
  }, [allCategoryPosts, timeFilter]);

  // Sort posts
  const sortedPosts = useMemo(() => {
    const sortFunctions = {
      newest: (a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      oldest: (a: any, b: any) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
      popular: (a: any, b: any) => b.views - a.views,
      trending: (a: any, b: any) => (b.likes + b.views * 0.1) - (a.likes + a.views * 0.1),
    };

    return [...filteredPosts].sort(sortFunctions[sortBy]);
  }, [filteredPosts, sortBy]);

  // Category stats
  const categoryStats = useMemo(() => {
    const totalViews = allCategoryPosts.reduce((sum, post) => sum + post.views, 0);
    const totalLikes = allCategoryPosts.reduce((sum, post) => sum + post.likes, 0);
    const avgReadingTime = allCategoryPosts.length > 0
      ? Math.round(allCategoryPosts.reduce((sum, post) => sum + post.readingTime, 0) / allCategoryPosts.length)
      : 0;

    return { totalViews, totalLikes, avgReadingTime };
  }, [allCategoryPosts]);

  // Related categories
  const relatedCategories = categories
    .filter(cat => cat !== categoryName)
    .slice(0, 4);

  if (!categoryName) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Category Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The category you're looking for doesn't exist.
            </p>
            <Link to="/categories">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse Categories
              </Button>
            </Link>
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
        {/* Hero */}
        <section className="container py-12">
          <Link to="/categories" className="inline-block mb-6">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              All Categories
            </Button>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                {categoryName}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
                {timeFilter !== 'all' && ` in the last ${timeFilter}`}
              </p>
            </div>

            {/* Category Stats */}
            <div className="flex gap-4">
              <Card className="px-4 py-2">
                <CardContent className="p-0">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{categoryStats.totalViews.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="px-4 py-2">
                <CardContent className="p-0">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{categoryStats.avgReadingTime}m</p>
                      <p className="text-xs text-muted-foreground">Avg Read</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Filters and Controls */}
        <section className="container pb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
                <SelectTrigger className="w-32">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-36">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Posts */}
        <section className="container pb-16">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No articles found for the selected filters.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setTimeFilter('all');
                  setSortBy('newest');
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-6"
            }>
              {sortedPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PostCard post={post} variant={viewMode === 'list' ? 'horizontal' : 'default'} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related Categories */}
        {relatedCategories.length > 0 && (
          <section className="container pb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Related Categories
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedCategories.map((category) => {
                const categoryPosts = posts.filter(p => p.category === category);
                return (
                  <Link
                    key={category}
                    to={`/category/${category.toLowerCase().replace(' & ', '-')}`}
                    className="card-elevated rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="font-semibold text-foreground mb-2">{category}</h3>
                    <p className="text-sm text-muted-foreground">
                      {categoryPosts.length} articles
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
