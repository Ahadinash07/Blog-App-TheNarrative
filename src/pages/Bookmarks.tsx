import { Link } from 'react-router-dom';
import { Bookmark, ArrowLeft, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleBookmark } from '@/store/blogSlice';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';

const Bookmarks = () => {
  const dispatch = useAppDispatch();
  const bookmarkedIds = useAppSelector((state) => state.blog.user.bookmarkedPosts);
  const posts = useAppSelector((state) => state.blog.posts);

  const bookmarkedPosts = posts.filter((p) => bookmarkedIds.includes(p.id));

  const handleClearAll = () => {
    bookmarkedIds.forEach((id) => dispatch(toggleBookmark(id)));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-12">
          <Link to="/" className="inline-block mb-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Bookmark className="h-6 w-6 text-primary" />
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Bookmarks
                </h1>
              </div>
              <p className="text-muted-foreground">
                {bookmarkedPosts.length} saved {bookmarkedPosts.length === 1 ? 'article' : 'articles'}
              </p>
            </div>

            {bookmarkedPosts.length > 0 && (
              <Button variant="outline" onClick={handleClearAll} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </section>

        {/* Bookmarked Posts */}
        <section className="container pb-16">
          {bookmarkedPosts.length === 0 ? (
            <div className="text-center py-16 card-elevated rounded-xl">
              <Bookmark className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                No bookmarks yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Save articles to read later by clicking the bookmark icon.
              </p>
              <Link to="/">
                <Button>Browse Articles</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarkedPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Bookmarks;
