import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Flame, TrendingUp, Eye, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import NewsletterCTA from '@/components/NewsletterCTA';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppSelector } from '@/store/hooks';

const Popular = () => {
  const posts = useAppSelector((state) => state.blog.posts);

  const mostViewed = useMemo(() => {
    return [...posts].sort((a, b) => b.views - a.views).slice(0, 9);
  }, [posts]);

  const mostLiked = useMemo(() => {
    return [...posts].sort((a, b) => b.likes - a.likes).slice(0, 9);
  }, [posts]);

  const trending = useMemo(() => {
    // Trending algorithm: combination of recent views and likes
    return [...posts]
      .map((post) => ({
        ...post,
        score: post.views * 0.3 + post.likes * 2,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 9);
  }, [posts]);

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
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Popular Articles
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Discover what's capturing the attention of our community. These are the articles 
              that readers can't stop talking about.
            </p>
          </section>

          {/* Tabs Section */}
          <section className="container pb-16">
            <Tabs defaultValue="trending" className="space-y-8">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="trending" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
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
              </TabsList>

              <TabsContent value="trending">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {trending.map((post, index) => (
                    <div
                      key={post.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="views">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {mostViewed.map((post, index) => (
                    <div
                      key={post.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="likes">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {mostLiked.map((post, index) => (
                    <div
                      key={post.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              </TabsContent>
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
