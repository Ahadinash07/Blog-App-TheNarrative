import { useState, useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Search, Sparkles, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import PostCard from '@/components/PostCard';
import { aiService, SmartSearchResult } from '@/services/aiService';

const SemanticSearch = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SmartSearchResult[]>([]);
  const posts = useAppSelector((state) => state.blog.posts);

  // AI-powered smart search
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = aiService.smartSearch(searchQuery, posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        tags: post.tags,
        category: post.category
      })));

      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to simple search
      const simpleResults = posts
        .filter(post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .map(post => ({
          postId: post.id,
          relevance: 1,
          matchedTerms: [searchQuery],
          context: [`Title: ${post.title}`]
        }));
      setSearchResults(simpleResults);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery);
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
                AI Search in progress...
              </div>
            )}
          </div>

          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((result, index) => {
                const post = posts.find(p => p.id === result.postId);
                if (!post) return null;

                return (
                  <Card key={result.postId} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg mb-1">{post.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {post.excerpt}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1 ml-4">
                              <Badge variant="outline" className="text-xs">
                                {Math.round(result.relevance)}% match
                              </Badge>
                              <Button variant="ghost" size="sm" asChild>
                                <a href={`/post/${post.slug}`}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  Read
                                </a>
                              </Button>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-2">
                            {result.matchedTerms.slice(0, 3).map((term, termIndex) => (
                              <Badge key={termIndex} variant="secondary" className="text-xs">
                                {term}
                              </Badge>
                            ))}
                          </div>

                          <Collapsible>
                            <CollapsibleTrigger className="text-xs text-muted-foreground hover:text-foreground">
                              Show context →
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 space-y-1">
                              {result.context.slice(0, 2).map((context, contextIndex) => (
                                <p key={contextIndex} className="text-xs text-muted-foreground bg-muted p-2 rounded">
                                  {context}
                                </p>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : query && !isSearching ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  No articles found for "{query}". Try different keywords or check your spelling.
                </p>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Try searching for:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['AI', 'Web Development', 'Design', 'Technology', 'Programming'].map((suggestion) => (
                      <Badge
                        key={suggestion}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleSearch(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
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