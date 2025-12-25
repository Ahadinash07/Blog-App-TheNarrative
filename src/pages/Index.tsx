import { useMemo, useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedPost from '@/components/FeaturedPost';
import PostCard from '@/components/PostCard';
import TrendingCard from '@/components/TrendingCard';
import CategoryFilter from '@/components/CategoryFilter';
import NewsletterCTA from '@/components/NewsletterCTA';
import WelcomePopup from '@/components/WelcomePopup';
import QuickViewPopup from '@/components/QuickViewPopup';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { TrendingUp, Sparkles, Clock, Flame, Loader2 } from 'lucide-react';
import { Post } from '@/types/blog';

const Index = () => {
  const posts = useAppSelector((state) => state.blog.posts);
  const searchQuery = useAppSelector((state) => state.blog.searchQuery);
  const selectedCategory = useAppSelector((state) => state.blog.selectedCategory);
  const [showWelcome, setShowWelcome] = useState(false);
  const [quickViewPost, setQuickViewPost] = useState<Post | null>(null);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setTimeout(() => setShowWelcome(true), 1500);
    }
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          post.author.name.toLowerCase().includes(query)
      );
    }
    if (selectedCategory) {
      result = result.filter((post) => post.category === selectedCategory);
    }
    return result;
  }, [posts, searchQuery, selectedCategory]);

  const featuredPost = posts.find((post) => post.featured);
  const trendingPosts = posts.filter((post) => post.trending).slice(0, 3);
  const mainPosts = filteredPosts.filter((post) => !post.featured);
  const recentPosts = posts.slice(0, 4);

  const { displayedItems, hasMore, isLoading, loaderRef } = useInfiniteScroll(mainPosts, 6);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {featuredPost && !searchQuery && !selectedCategory && (
          <section className="container py-8 md:py-12 animate-fade-in">
            <FeaturedPost post={featuredPost} />
          </section>
        )}

        {trendingPosts.length > 0 && !searchQuery && !selectedCategory && (
          <section className="container py-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Flame className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Trending Now</h2>
              <TrendingUp className="h-5 w-5 text-accent ml-1" />
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {trendingPosts.map((post, index) => (
                <div key={post.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <TrendingCard post={post} rank={index + 1} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="container py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-foreground">
                {searchQuery ? `Search results for "${searchQuery}"` : selectedCategory ? selectedCategory : 'Latest Articles'}
              </h2>
            </div>
            <CategoryFilter />
          </div>
        </section>

        <section className="container pb-12">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No articles found. Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="grid gap-6 sm:grid-cols-2">
                  {displayedItems.map((post, index) => (
                    <div key={post.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <PostCard post={post} onQuickView={() => setQuickViewPost(post)} />
                    </div>
                  ))}
                </div>
                <div ref={loaderRef} className="flex justify-center py-8">
                  {isLoading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
                  {!hasMore && displayedItems.length > 0 && (
                    <p className="text-muted-foreground">You've reached the end</p>
                  )}
                </div>
              </div>
              <aside className="space-y-8">
                <div className="card-elevated rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-4 w-4 text-primary" />
                    <h3 className="font-display text-lg font-semibold text-foreground">Recent Posts</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {recentPosts.map((post) => (
                      <PostCard key={post.id} post={post} variant="compact" />
                    ))}
                  </div>
                </div>
                <NewsletterCTA />
                <div className="card-elevated rounded-xl p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(posts.flatMap((p) => p.tags))).slice(0, 12).map((tag) => (
                      <button key={tag} className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          )}
        </section>

        {!searchQuery && !selectedCategory && (
          <section className="container pb-16"><NewsletterCTA /></section>
        )}
      </main>
      <Footer />
      <WelcomePopup open={showWelcome} onClose={handleCloseWelcome} />
      <QuickViewPopup post={quickViewPost} open={!!quickViewPost} onClose={() => setQuickViewPost(null)} />
    </div>
  );
};

export default Index;
