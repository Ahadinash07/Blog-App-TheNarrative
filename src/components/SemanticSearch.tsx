import { useState, useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PostCard from '@/components/PostCard';

const SemanticSearch = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const posts = useAppSelector((state) => state.blog.posts);

  // Simple semantic search (in a real app, this would use AI/vector search)
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => setIsSearching(false), 500);

    const searchTerms = query.toLowerCase().split(' ');
    const scoredPosts = posts.map(post => {
      let score = 0;
      const title = post.title.toLowerCase();
      const content = post.content.toLowerCase();
      const excerpt = post.excerpt.toLowerCase();
      const tags = post.tags.join(' ').toLowerCase();

      searchTerms.forEach(term => {
        // Title matches get highest score
        if (title.includes(term)) score += 10;
        // Tag matches get high score
        if (tags.includes(term)) score += 8;
        // Content matches get medium score
        if (content.includes(term)) score += 3;
        // Excerpt matches get lower score
        if (excerpt.includes(term)) score += 2;
      });

      return { post, score };
    });

    return scoredPosts
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.post);
  }, [query, posts]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles, topics, or ask questions..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => handleSearch(query)}
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Try searching for topics like "AI", "web development", or "design principles"
          </p>
        </CardContent>
      </Card>

      {/* Search Results */}
      {query && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Search Results {searchResults.length > 0 && `(${searchResults.length})`}
            </h3>
            {isSearching && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                Searching...
              </div>
            )}
          </div>

          {searchResults.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : query && !isSearching ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No articles found for "{query}". Try different keywords or check your spelling.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}

      {/* Search Suggestions */}
      {!query && (
        <Card>
          <CardHeader>
            <CardTitle>Popular Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['AI', 'Web Development', 'Design', 'Technology', 'Programming', 'UX'].map((term) => (
                <Badge
                  key={term}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleSearch(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SemanticSearch;