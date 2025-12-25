import { useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '@/store/hooks';
import { aiService } from '@/services/aiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, BookOpen } from 'lucide-react';
import PostCard from '@/components/PostCard';

const AIRecommendations = () => {
  const user = useAppSelector((state) => state.blog.currentUser);
  const posts = useAppSelector((state) => state.blog.posts);
  const readingHistory = useAppSelector((state) => state.blog.user.readingHistory);

  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const generateRecommendations = useCallback(async () => {
    if (!user || readingHistory.length === 0) return;

    setIsLoading(true);
    try {
      const availablePosts = posts.map(post => ({
        id: post.id,
        title: post.title,
        tags: post.tags,
        category: post.category,
      }));

      const recommendedIds = await aiService.generateRecommendations({
        userHistory: readingHistory,
        availablePosts,
        count: 6,
      });

      setRecommendations(recommendedIds);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, readingHistory, posts]);

  useEffect(() => {
    // Auto-generate recommendations when component mounts and user has reading history
    if (user && readingHistory.length > 0 && recommendations.length === 0) {
      generateRecommendations();
    }
  }, [user, readingHistory.length, generateRecommendations, recommendations.length]);

  const recommendedPosts = posts.filter(post => recommendations.includes(post.id));

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Log in to get personalized AI recommendations.</p>
        </CardContent>
      </Card>
    );
  }

  if (readingHistory.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Start Reading to Get Recommendations</h3>
          <p className="text-muted-foreground">
            Read a few articles and our AI will suggest personalized recommendations based on your interests.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Recommendations
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateRecommendations}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
        {lastUpdated && (
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Generating recommendations...</span>
          </div>
        ) : recommendedPosts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendedPosts.map((post) => (
              <PostCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No recommendations available. Try reading more articles to improve suggestions.
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">How it works:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Analyzes your reading history and preferences</li>
            <li>• Considers categories, tags, and content similarity</li>
            <li>• Uses AI to find articles you'll enjoy</li>
            <li>• Updates recommendations as you read more</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;