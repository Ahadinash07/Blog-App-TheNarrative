import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Tags as TagsIcon, Search, Hash, TrendingUp, BarChart3, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppSelector } from '@/store/hooks';

type SortOption = 'popular' | 'alphabetical' | 'recent' | 'trending';

interface TagStat {
  tag: string;
  count: number;
  views: number;
  likes: number;
  recentPosts: number;
  trending: boolean;
}

const Tags = () => {
  const posts = useAppSelector((state) => state.blog.posts);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [minArticles, setMinArticles] = useState<number>(1);

  const tagStats = useMemo(() => {
    const stats: Record<string, {
      count: number;
      views: number;
      likes: number;
      recentPosts: number;
      trending: boolean;
    }> = {};

    // Get posts from last 30 days for trending calculation
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        if (!stats[tag]) {
          stats[tag] = { count: 0, views: 0, likes: 0, recentPosts: 0, trending: false };
        }
        stats[tag].count += 1;
        stats[tag].views += post.views;
        stats[tag].likes += post.likes;

        // Count recent posts
        if (new Date(post.publishedAt) > thirtyDaysAgo) {
          stats[tag].recentPosts += 1;
        }
      });
    });

    // Mark trending tags (high recent activity)
    Object.keys(stats).forEach(tag => {
      const stat = stats[tag];
      stat.trending = stat.recentPosts >= 3 && stat.count >= 5;
    });

    return Object.entries(stats)
      .map(([tag, data]) => ({ tag, ...data }))
      .filter(tag => tag.count >= minArticles);
  }, [posts, minArticles]);

  const filteredAndSortedTags = useMemo(() => {
    let filtered = tagStats;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t) =>
        t.tag.toLowerCase().includes(query)
      );
    }

    // Sort
    const sortFunctions = {
      popular: (a: TagStat, b: TagStat) => b.count - a.count,
      alphabetical: (a: TagStat, b: TagStat) => a.tag.localeCompare(b.tag),
      recent: (a: TagStat, b: TagStat) => b.recentPosts - a.recentPosts,
      trending: (a: TagStat, b: TagStat) => {
        if (a.trending && !b.trending) return -1;
        if (!a.trending && b.trending) return 1;
        return b.count - a.count;
      },
    };

    return filtered.sort(sortFunctions[sortBy]);
  }, [tagStats, searchQuery, sortBy]);

  const getTagSize = (count: number) => {
    const max = Math.max(...tagStats.map((t) => t.count));
    const ratio = count / max;
    if (ratio > 0.7) return 'text-2xl font-bold';
    if (ratio > 0.5) return 'text-xl font-semibold';
    if (ratio > 0.3) return 'text-lg font-medium';
    return 'text-base';
  };

  const getTagColor = (tag: TagStat) => {
    if (tag.trending) return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
    if (tag.recentPosts > 0) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    return 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground';
  };

  // Tag analytics
  const tagAnalytics = useMemo(() => {
    const totalTags = tagStats.length;
    const trendingTags = tagStats.filter(t => t.trending).length;
    const avgArticlesPerTag = totalTags > 0 ? Math.round(tagStats.reduce((sum, tag) => sum + tag.count, 0) / totalTags) : 0;
    const mostPopularTag = tagStats.sort((a, b) => b.count - a.count)[0];

    return {
      totalTags,
      trendingTags,
      avgArticlesPerTag,
      mostPopularTag,
    };
  }, [tagStats]);

  return (
    <>
      <Helmet>
        <title>Browse Tags - TheNarrative</title>
        <meta name="description" content="Explore all topics and tags on TheNarrative. Find articles on web development, AI, design, programming, and more." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="container py-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TagsIcon className="h-5 w-5 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Browse Tags
              </h1>
            </div>
            <p className="text-muted-foreground mb-8">
              {tagAnalytics.totalTags} topics across {posts.length} articles
            </p>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="alphabetical">A-Z</SelectItem>
                  <SelectItem value="recent">Recently Active</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={minArticles.toString()} onValueChange={(value) => setMinArticles(Number(value))}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1+ articles</SelectItem>
                  <SelectItem value="3">3+ articles</SelectItem>
                  <SelectItem value="5">5+ articles</SelectItem>
                  <SelectItem value="10">10+ articles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Tag Analytics */}
          <section className="container pb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{tagAnalytics.totalTags}</div>
                  <div className="text-sm text-muted-foreground">Total Tags</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{tagAnalytics.trendingTags}</div>
                  <div className="text-sm text-muted-foreground">Trending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{tagAnalytics.avgArticlesPerTag}</div>
                  <div className="text-sm text-muted-foreground">Avg Articles/Tag</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{tagAnalytics.mostPopularTag?.count || 0}</div>
                  <div className="text-sm text-muted-foreground">Most Popular</div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Tag Cloud */}
          <section className="container pb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Tag Cloud
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-3">
                  {filteredAndSortedTags.map((tag) => (
                    <Link
                      key={tag.tag}
                      to={`/?tag=${encodeURIComponent(tag.tag)}`}
                      className={`${getTagSize(tag.count)} transition-all hover:scale-105`}
                    >
                      <Badge
                        className={`${getTagColor(tag)} px-3 py-1 cursor-pointer transition-colors`}
                      >
                        #{tag.tag}
                        {tag.trending && <TrendingUp className="h-3 w-3 ml-1 inline" />}
                        <span className="ml-2 text-xs opacity-75">({tag.count})</span>
                      </Badge>
                    </Link>
                  ))}
                </div>
                {filteredAndSortedTags.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No tags match your criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Tag Details Table */}
          <section className="container pb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Tag Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Tag</th>
                        <th className="text-center py-2 font-medium">Articles</th>
                        <th className="text-center py-2 font-medium">Total Views</th>
                        <th className="text-center py-2 font-medium">Total Likes</th>
                        <th className="text-center py-2 font-medium">Recent Activity</th>
                        <th className="text-center py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedTags.slice(0, 20).map((tag) => (
                        <tr key={tag.tag} className="border-b hover:bg-muted/50">
                          <td className="py-3">
                            <Link
                              to={`/?tag=${encodeURIComponent(tag.tag)}`}
                              className="font-medium text-primary hover:underline"
                            >
                              #{tag.tag}
                            </Link>
                          </td>
                          <td className="text-center py-3">{tag.count}</td>
                          <td className="text-center py-3">{tag.views.toLocaleString()}</td>
                          <td className="text-center py-3">{tag.likes.toLocaleString()}</td>
                          <td className="text-center py-3">{tag.recentPosts} recent</td>
                          <td className="text-center py-3">
                            {tag.trending ? (
                              <Badge className="bg-orange-500">Trending</Badge>
                            ) : tag.recentPosts > 0 ? (
                              <Badge variant="secondary">Active</Badge>
                            ) : (
                              <Badge variant="outline">Stable</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredAndSortedTags.length > 20 && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing top 20 tags. Use search to find specific tags.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Tags;
