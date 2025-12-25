import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, Bookmark, Heart, Clock, Eye, Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleBookmark, togglePostLike, addToReadingHistory, incrementPostViews } from '@/store/blogSlice';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReadingProgress from '@/components/ReadingProgress';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import CommentSection from '@/components/CommentSection';
import ShareButtons from '@/components/ShareButtons';
import NewsletterCTA from '@/components/NewsletterCTA';
import PostCard from '@/components/PostCard';
import AISummary from '@/components/AISummary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  
  const post = useAppSelector((state) =>
    state.blog.posts.find((p) => p.slug === slug)
  );
  const posts = useAppSelector((state) => state.blog.posts);
  const bookmarkedPosts = useAppSelector((state) => state.blog.user.bookmarkedPosts);
  const likedPosts = useAppSelector((state) => state.blog.user.likedPosts);

  const isBookmarked = post ? bookmarkedPosts.includes(post.id) : false;
  const isLiked = post ? likedPosts.includes(post.id) : false;

  // Related posts
  const relatedPosts = post
    ? posts
        .filter(
          (p) =>
            p.id !== post.id &&
            (p.category === post.category ||
              p.tags.some((tag) => post.tags.includes(tag)))
        )
        .slice(0, 3)
    : [];

  useEffect(() => {
    if (slug) {
      const currentPost = posts.find((p) => p.slug === slug);
      if (currentPost) {
        dispatch(addToReadingHistory(currentPost.id));
        dispatch(incrementPostViews(currentPost.id));
      }
      window.scrollTo(0, 0);
    }
  }, [slug, dispatch, posts]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Article Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been removed.
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

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('# ')) {
          return (
            <h1 key={i} className="font-display text-3xl font-bold text-foreground mt-8 mb-4">
              {line.slice(2)}
            </h1>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={i} className="font-display text-2xl font-semibold text-foreground mt-8 mb-3">
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={i} className="font-display text-xl font-semibold text-foreground mt-6 mb-2">
              {line.slice(4)}
            </h3>
          );
        }
        // Blockquotes
        if (line.startsWith('> ')) {
          return (
            <blockquote
              key={i}
              className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground bg-muted/50 rounded-r-lg"
            >
              {line.slice(2)}
            </blockquote>
          );
        }
        // Code blocks (simple)
        if (line.startsWith('```')) {
          return null;
        }
        // List items
        if (line.startsWith('- ')) {
          return (
            <li key={i} className="ml-6 text-foreground/90 list-disc">
              {line.slice(2)}
            </li>
          );
        }
        if (line.match(/^\d+\. /)) {
          return (
            <li key={i} className="ml-6 text-foreground/90 list-decimal">
              {line.replace(/^\d+\. /, '')}
            </li>
          );
        }
        // Horizontal rule
        if (line.startsWith('---')) {
          return <Separator key={i} className="my-8" />;
        }
        // Regular paragraph
        if (line.trim()) {
          return (
            <p key={i} className="text-foreground/90 leading-relaxed mb-4">
              {line}
            </p>
          );
        }
        return null;
      })
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ReadingProgress />
      <ReadingProgressBar />
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <article>
          <div className="relative">
            {/* Cover Image */}
            <div className="h-[40vh] md:h-[50vh] w-full overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="container relative -mt-32 md:-mt-40">
              <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <Link to="/" className="inline-block mb-4">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Link to={`/category/${post.category.toLowerCase().replace(' & ', '-')}`}>
                    <Badge className="bg-primary text-primary-foreground">{post.category}</Badge>
                  </Link>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readingTime} min read
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.views.toLocaleString()} views
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  {post.title}
                </h1>

                {/* Author & Date */}
                <div className="flex items-center justify-between flex-wrap gap-4 mt-6">
                  <Link
                    to={`/author/${post.author.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-background"
                    />
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {post.author.name}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </Link>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => dispatch(togglePostLike(post.id))}
                      className="relative"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          isLiked ? 'fill-primary text-primary' : ''
                        }`}
                      />
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {post.likes}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => dispatch(toggleBookmark(post.id))}
                    >
                      <Bookmark
                        className={`h-4 w-4 transition-colors ${
                          isBookmarked ? 'fill-primary text-primary' : ''
                        }`}
                      />
                    </Button>
                    <ShareButtons
                      url={window.location.href}
                      title={post.title}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="container py-12">
            <div className="max-w-3xl mx-auto">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* AI Summary */}
              <AISummary postId={post.id} content={post.content} />

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {formatContent(post.content)}
              </div>

              {/* Author Bio */}
              <div className="mt-12 p-6 card-elevated rounded-xl">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={`/author/${post.author.id}`}>
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  </Link>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Written by</p>
                    <Link to={`/author/${post.author.id}`}>
                      <h4 className="font-display text-xl font-semibold text-foreground hover:text-primary transition-colors">
                        {post.author.name}
                      </h4>
                    </Link>
                    <p className="mt-2 text-muted-foreground">{post.author.bio}</p>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <CommentSection postId={post.id} />
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="container pb-16">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              Related Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="container pb-16">
          <NewsletterCTA />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PostDetail;
