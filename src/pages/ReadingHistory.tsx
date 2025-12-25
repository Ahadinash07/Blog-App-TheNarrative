import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { History, Trash2, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';

const ReadingHistory = () => {
  const readingHistory = useAppSelector((state) => state.blog.user.readingHistory);
  const posts = useAppSelector((state) => state.blog.posts);

  const historyPosts = readingHistory
    .map((postId) => posts.find((p) => p.id === postId))
    .filter(Boolean);

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
                  {historyPosts.length} {historyPosts.length === 1 ? 'article' : 'articles'} in your history
                </p>
              </div>

              {historyPosts.length > 0 && (
                <Button variant="outline" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear History
                </Button>
              )}
            </div>
          </section>

          {/* History List */}
          <section className="container pb-16">
            {historyPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                  No reading history yet
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Articles you read will appear here so you can easily find them again.
                </p>
                <Link to="/">
                  <Button>Start Reading</Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {historyPosts.map((post, index) => (
                  <div
                    key={post!.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PostCard post={post!} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ReadingHistory;
