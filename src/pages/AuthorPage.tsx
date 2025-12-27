import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Twitter, Globe, FileText, Users } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';

const AuthorPage = () => {
  const { id } = useParams<{ id: string }>();
  const authors = useAppSelector((state) => state.blog.authors);
  const posts = useAppSelector((state) => state.blog.posts);

  const author = authors.find((a) => a.id === id);
  const authorPosts = author ? posts.filter((p) => p.author?.id === author.id) : [];

  if (!author) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Author Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The author you're looking for doesn't exist.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Safely construct URLs
  const twitterUrl = author.twitter
    ? `https://twitter.com/${author.twitter.replace('@', '').replace(/^https?:\/\/twitter\.com\//, '')}`
    : null;

  const websiteUrl = author.website
    ? author.website.startsWith('http')
      ? author.website
      : `https://${author.website}`
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Author Hero */}
        <section className="container py-12">
          <Link to="/" className="inline-block mb-8">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar with fallback */}
            <div className="relative">
              <img
                src={author.avatar || '/fallback-avatar.png'} // Replace with your actual fallback image path
                alt={author.name}
                onError={(e) => {
                  e.currentTarget.src = '/fallback-avatar.png'; // Fallback if image fails
                }}
                className="h-32 w-32 md:h-40 md:w-40 rounded-full object-cover ring-4 ring-primary/20 shadow-lg"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {author.name}
              </h1>
              {author.bio && (
                <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
                  {author.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-5 w-5" />
                  <span className="font-semibold text-foreground">{authorPosts.length}</span>
                  <span>Articles</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold text-foreground">
                    {author.followersCount?.toLocaleString() || '0'}
                  </span>
                  <span>Followers</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-8">
                {twitterUrl && (
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow ${author.name} on Twitter`}
                  >
                    <Button variant="outline" size="icon">
                      <Twitter className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                {websiteUrl && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${author.name}'s website`}
                  >
                    <Button variant="outline" size="icon">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Author's Posts */}
        <section className="container pb-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8">
            Articles by {author.name}
          </h2>

          {authorPosts.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-lg">
              <p className="text-xl text-muted-foreground">
                No articles from this author yet.
              </p>
              <p className="text-muted-foreground mt-2">
                Check back later for new content!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {authorPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-slide-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
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

export default AuthorPage;