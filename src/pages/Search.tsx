import { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search as SearchIcon, Filter, X, Clock, TrendingUp, History, SlidersHorizontal, Calendar, Tag, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SemanticSearch from '@/components/SemanticSearch';
import PostCard from '@/components/PostCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useAppSelector } from '@/store/hooks';

type SortOption = 'relevance' | 'date' | 'views' | 'likes';
type DateFilter = 'all' | 'week' | 'month' | 'year';

interface SearchFilters {
  categories: string[];
  authors: string[];
  tags: string[];
  dateRange: DateFilter;
  minViews: number;
  minLikes: number;
}

const Search = () => {
  const posts = useAppSelector((state) => state.blog.posts);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    authors: [],
    tags: [],
    dateRange: 'all',
    minViews: 0,
    minLikes: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('search-history') || '[]');
  });

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const categories = [...new Set(posts.map(p => p.category))];
    const authors = [...new Set(posts.map(p => p.author.name))];
    const tags = [...new Set(posts.flatMap(p => p.tags))];

    return { categories, authors, tags };
  }, [posts]);

  // Filter posts based on search query and filters
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Text search
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        post.author.name.toLowerCase().includes(searchTerm) ||
        post.category.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(post => filters.categories.includes(post.category));
    }

    // Author filter
    if (filters.authors.length > 0) {
      filtered = filtered.filter(post => filters.authors.includes(post.author.name));
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(post => filters.tags.some(tag => filters.tags.includes(tag)));
    }

    // Date filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const dateFilters = {
        week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        year: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
      };
      const cutoffDate = dateFilters[filters.dateRange as keyof typeof dateFilters];
      filtered = filtered.filter(post => new Date(post.publishedAt) >= cutoffDate);
    }

    // Views and likes filters
    filtered = filtered.filter(post =>
      post.views >= filters.minViews && post.likes >= filters.minLikes
    );

    return filtered;
  }, [posts, query, filters]);

  // Sort posts
  const sortedPosts = useMemo(() => {
    const sortFunctions = {
      relevance: (a: Post, b: Post) => {
        // Simple relevance scoring based on matches
        const aScore = (a.title.toLowerCase().includes(query.toLowerCase()) ? 3 : 0) +
                      (a.excerpt.toLowerCase().includes(query.toLowerCase()) ? 2 : 0) +
                      (a.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase())) ? 1 : 0);
        const bScore = (b.title.toLowerCase().includes(query.toLowerCase()) ? 3 : 0) +
                      (b.excerpt.toLowerCase().includes(query.toLowerCase()) ? 2 : 0) +
                      (b.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase())) ? 1 : 0);
        return bScore - aScore;
      },
      date: (a: Post, b: Post) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      views: (a: Post, b: Post) => b.views - a.views,
      likes: (a: Post, b: Post) => b.likes - a.likes,
    };

    return [...filteredPosts].sort(sortFunctions[sortBy]);
  }, [filteredPosts, sortBy, query]);

  // Search analytics
  const searchAnalytics = useMemo(() => {
    return {
      totalResults: sortedPosts.length,
      avgViews: sortedPosts.length > 0 ? Math.round(sortedPosts.reduce((sum, p) => sum + p.views, 0) / sortedPosts.length) : 0,
      avgLikes: sortedPosts.length > 0 ? Math.round(sortedPosts.reduce((sum, p) => sum + p.likes, 0) / sortedPosts.length) : 0,
      topCategory: sortedPosts.length > 0 ? sortedPosts.reduce((acc, post) => {
        acc[post.category] = (acc[post.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) : {},
    };
  }, [sortedPosts]);

  // Save search to history
  const saveSearchToHistory = (searchQuery: string) => {
    if (searchQuery.trim()) {
      const updatedHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
      setSearchHistory(updatedHistory);
      localStorage.setItem('search-history', JSON.stringify(updatedHistory));
    }
  };

  // Handle search
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    saveSearchToHistory(searchQuery);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      categories: [],
      authors: [],
      tags: [],
      dateRange: 'all',
      minViews: 0,
      minLikes: 0,
    });
  };

  // Update filter
  const updateFilter = (key: keyof SearchFilters, value: string[] | DateFilter | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Toggle array filter
  const toggleArrayFilter = (key: 'categories' | 'authors' | 'tags', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item: string) => item !== value)
        : [...prev[key], value]
    }));
  };

  return (
    <>
      <Helmet>
        <title>Search Articles - TheNarrative</title>
        <meta name="description" content="Search through our collection of articles with advanced filters and AI-powered semantic search." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="container py-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <SearchIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    Discover Articles
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground">
                  Search through our collection of articles using AI-powered semantic search and advanced filters
                </p>
              </div>

              {/* Search Input */}
              <div className="relative mb-6">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles, topics, authors..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                  className="pl-12 pr-12 h-12 text-lg"
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Search History */}
              {!query && searchHistory.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.slice(0, 6).map((historyItem, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSearch(historyItem)}
                        className="gap-2"
                      >
                        <Clock className="h-3 w-3" />
                        {historyItem}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Most Relevant</SelectItem>
                      <SelectItem value="date">Newest First</SelectItem>
                      <SelectItem value="views">Most Viewed</SelectItem>
                      <SelectItem value="likes">Most Liked</SelectItem>
                    </SelectContent>
                  </Select>

                  <Popover open={showFilters} onOpenChange={setShowFilters}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                        {(filters.categories.length + filters.authors.length + filters.tags.length +
                          (filters.dateRange !== 'all' ? 1 : 0) + (filters.minViews > 0 ? 1 : 0) + (filters.minLikes > 0 ? 1 : 0)) > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {filters.categories.length + filters.authors.length + filters.tags.length +
                             (filters.dateRange !== 'all' ? 1 : 0) + (filters.minViews > 0 ? 1 : 0) + (filters.minLikes > 0 ? 1 : 0)}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="start">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Filters</h4>
                          <Button variant="ghost" size="sm" onClick={clearFilters}>
                            Clear All
                          </Button>
                        </div>

                        <Separator />

                        {/* Date Range */}
                        <div>
                          <label className="text-sm font-medium flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4" />
                            Date Range
                          </label>
                          <Select value={filters.dateRange} onValueChange={(value: DateFilter) => updateFilter('dateRange', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Time</SelectItem>
                              <SelectItem value="year">Past Year</SelectItem>
                              <SelectItem value="month">Past Month</SelectItem>
                              <SelectItem value="week">Past Week</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Categories */}
                        <div>
                          <label className="text-sm font-medium flex items-center gap-2 mb-2">
                            <Tag className="h-4 w-4" />
                            Categories
                          </label>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {filterOptions.categories.map(category => (
                              <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`category-${category}`}
                                  checked={filters.categories.includes(category)}
                                  onCheckedChange={() => toggleArrayFilter('categories', category)}
                                />
                                <label htmlFor={`category-${category}`} className="text-sm">
                                  {category}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Authors */}
                        <div>
                          <label className="text-sm font-medium flex items-center gap-2 mb-2">
                            <User className="h-4 w-4" />
                            Authors
                          </label>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {filterOptions.authors.map(author => (
                              <div key={author} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`author-${author}`}
                                  checked={filters.authors.includes(author)}
                                  onCheckedChange={() => toggleArrayFilter('authors', author)}
                                />
                                <label htmlFor={`author-${author}`} className="text-sm">
                                  {author}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Results Count */}
                <div className="text-sm text-muted-foreground">
                  {searchAnalytics.totalResults} {searchAnalytics.totalResults === 1 ? 'result' : 'results'}
                  {query && ` for "${query}"`}
                </div>
              </div>
            </div>
          </section>

          {/* Results */}
          {query || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== 'all' && f !== 0) ? (
            <section className="container pb-16">
              {sortedPosts.length === 0 ? (
                <div className="text-center py-16">
                  <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                    No results found
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search terms or filters.
                  </p>
                  <Button variant="outline" onClick={() => { setQuery(''); clearFilters(); }}>
                    Clear Search & Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Search Analytics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">{searchAnalytics.totalResults}</div>
                        <div className="text-sm text-muted-foreground">Results Found</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{searchAnalytics.avgViews}</div>
                        <div className="text-sm text-muted-foreground">Avg Views</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{searchAnalytics.avgLikes}</div>
                        <div className="text-sm text-muted-foreground">Avg Likes</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Object.keys(searchAnalytics.topCategory).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Categories</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Results Grid */}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          ) : (
            /* Default State - Show Semantic Search */
            <section className="container pb-16">
              <div className="max-w-4xl mx-auto">
                <SemanticSearch />
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Search;