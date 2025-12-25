import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { History, Trash2, BookOpen, Clock, Calendar, Filter, Search, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearReadingHistory } from '@/store/blogSlice';
import { useToast } from '@/hooks/use-toast';

type SortOption = 'recent' | 'oldest' | 'longest' | 'shortest';
type FilterOption = 'all' | 'completed' | 'in-progress';

const ReadingHistory = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const readingHistory = useAppSelector((state) => state.blog.user.readingHistory);
  const readingProgress = useAppSelector((state) => state.blog.user.readingProgress);
  const posts = useAppSelector((state) => state.blog.posts);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const historyPosts = readingHistory
    .map((postId) => posts.find((p) => p.id === postId))
    .filter(Boolean)
    .map(post => ({
      ...post!,
      progress: readingProgress[post!.id] || 0,
      isCompleted: (readingProgress[post!.id] || 0) >= 90,
    }));

  // Filter posts
  const filteredPosts = useMemo(() => {
    let filtered = historyPosts;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (filterBy === 'completed') {
      filtered = filtered.filter(post => post.isCompleted);
    } else if (filterBy === 'in-progress') {
      filtered = filtered.filter(post => !post.isCompleted && post.progress > 0);
    }

    return filtered;
  }, [historyPosts, searchQuery, filterBy]);

  // Sort posts
  const sortedPosts = useMemo(() => {
    const sortFunctions = {
      recent: (a: any, b: any) => {
        const aIndex = readingHistory.indexOf(a.id);
        const bIndex = readingHistory.indexOf(b.id);
        return aIndex - bIndex;
      },
      oldest: (a: any, b: any) => {
        const aIndex = readingHistory.indexOf(a.id);
        const bIndex = readingHistory.indexOf(b.id);
        return bIndex - aIndex;
      },
      longest: (a: any, b: any) => b.readingTime - a.readingTime,
      shortest: (a: any, b: any) => a.readingTime - b.readingTime,
    };

    return [...filteredPosts].sort(sortFunctions[sortBy]);
  }, [filteredPosts, sortBy, readingHistory]);

  // Reading stats
  const readingStats = useMemo(() => {
    const totalArticles = historyPosts.length;
    const completedArticles = historyPosts.filter(p => p.isCompleted).length;
    const totalReadingTime = historyPosts.reduce((sum, post) => sum + post.readingTime, 0);
    const avgReadingTime = totalArticles > 0 ? Math.round(totalReadingTime / totalArticles) : 0;

    return {
      totalArticles,
      completedArticles,
      totalReadingTime,
      avgReadingTime,
      completionRate: totalArticles > 0 ? Math.round((completedArticles / totalArticles) * 100) : 0,
    };
  }, [historyPosts]);

  const handleClearHistory = () => {
    dispatch(clearReadingHistory());
    setShowClearConfirm(false);
    toast({
      title: 'Reading history cleared',
      description: 'All reading history has been removed.',
    });
  };

  return (
    <>
      <Helmet>
        <title>Reading History - TheNarrative</title>
        <meta name="description" content="View your reading history on TheNarrative. Pick up where you left off on your favorite articles." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="container py-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <History className="h-5 w-5 text-primary" />
                  </div>
                  <h1 className="font-display text-3xl font-bold text-foreground">
                    Reading History
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  {readingStats.totalArticles} {readingStats.totalArticles === 1 ? 'article' : 'articles'} in your history
                </p>
              </div>

              {readingStats.totalArticles > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowClearConfirm(true)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear History
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Reading Stats */}
          {readingStats.totalArticles > 0 && (
            <section className="container pb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{readingStats.totalArticles}</div>
                    <div className="text-sm text-muted-foreground">Total Articles</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{readingStats.completedArticles}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{readingStats.totalReadingTime}m</div>
                    <div className="text-sm text-muted-foreground">Total Time</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{readingStats.completionRate}%</div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {/* Filters and Search */}
          {readingStats.totalArticles > 0 && (
            <section className="container pb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search your reading history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Articles</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="longest">Longest</SelectItem>
                    <SelectItem value="shortest">Shortest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>
          )}

          {/* History List */}
          <section className="container pb-16">
            {sortedPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                  {readingStats.totalArticles === 0 ? 'No reading history yet' : 'No articles match your filters'}
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {readingStats.totalArticles === 0
                    ? 'Articles you read will appear here so you can easily find them again.'
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
                {readingStats.totalArticles === 0 ? (
                  <Link to="/">
                    <Button>Start Reading</Button>
                  </Link>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterBy('all');
                      setSortBy('recent');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedPosts.map((post, index) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <Link to={`/post/${post.slug}`}>
                                <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                                  {post.title}
                                </h3>
                              </Link>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {post.excerpt}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {post.readingTime}m read
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(post.publishedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant={post.isCompleted ? 'default' : 'secondary'}>
                                {post.isCompleted ? 'Completed' : `${Math.round(post.progress)}%`}
                              </Badge>
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${post.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Clear History Confirmation */}
          {showClearConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Clear Reading History?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    This action cannot be undone. All your reading history will be permanently removed.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowClearConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handleClearHistory}
                    >
                      Clear History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ReadingHistory;
