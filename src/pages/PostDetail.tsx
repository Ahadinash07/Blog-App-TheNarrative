import { useParams, Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { ArrowLeft, Bookmark, Heart, Clock, Eye, Calendar } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  toggleBookmark,
  togglePostLike,
  addToReadingHistory,
  incrementPostViews,
} from '@/store/blogSlice';
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

  const posts = useAppSelector((state) => state.blog.posts);
  const bookmarkedPosts = useAppSelector((state) => state.blog.user?.bookmarkedPosts || []);
  const likedPosts = useAppSelector((state) => state.blog.user?.likedPosts || []);

  const post = useMemo(() => {
    return posts.find((p) => p.slug === slug);
  }, [posts, slug]);

  const isBookmarked = post ? bookmarkedPosts.includes(post.id) : false;
  const isLiked = post ? likedPosts.includes(post.id) : false;

  // Related posts
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return posts
      .filter(
        (p) =>
          p.id !== post.id &&
          (p.category === post.category || p.tags.some((tag) => post.tags.includes(tag)))
      )
      .slice(0, 3);
  }, [post, posts]);

  // Only run once when post is found
  useEffect(() => {
    if (post) {
      dispatch(addToReadingHistory(post.id));
      dispatch(incrementPostViews(post.id));
      window.scrollTo(0, 0);
    }
  }, [post?.id, dispatch]); // Only depend on post.id, not full posts array

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

  // Improved content formatter with proper lists, code blocks, images
  const formatContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Skip empty lines but add spacing
      if (!line.trim()) {
        if (elements.length > 0 && elements[elements.length - 1]?.type !== 'br') {
          elements.push(<div key={`br-${i}`} className="mb-4" />);
        }
        i++;
        continue;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="font-display text-xl font-semibold mt-8 mb-4">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="font-display text-2xl font-semibold mt-10 mb-5">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="font-display text-3xl font-bold mt-12 mb-6">
            {line.slice(2)}
          </h1>
        );
      }
      // Blockquote
      else if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={i}
            className="border-l-4 border-primary pl-6 py-3 my-8 italic text-muted-foreground bg-muted/50 rounded-r-lg"
          >
            {line.slice(2)}
          </blockquote>
        );
      }
      // Code block
      else if (line.startsWith('```')) {
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++; // skip closing ```
        elements.push(
          <pre key={`code-${i}`} className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
            <code className="text-sm">{codeLines.join('\n')}</code>
          </pre>
        );
        continue;
      }
      // Image: ![alt](url)
      else if (line.startsWith('![') && line.includes('](')) {
        const altMatch = line.match(/!\[([^]*?)\]\(([^)]+)\)/);
        if (altMatch) {
          const alt = altMatch[1];
          const src = altMatch[2];
          elements.push(
            <div key={i} className="my-10 flex justify-center">
              <img
                src={src}
                alt={alt}
                className="max-w-full h-auto rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          );
        }
      }
      // Unordered list
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        const items: string[] = [];
        while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
          items.push(lines[i].slice(2));
          i++;
        }
        elements.push(
          <ul key={`ul-${i}`} className="list-disc ml-8 my-6 space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="text-foreground/90 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        );
        continue;
      }
      // Ordered list
      else if (line.match(/^\d+\.\s/)) {
        const items: string[] = [];
        while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
          items.push(lines[i].replace(/^\d+\.\s/, ''));
          i++;
        }
        elements.push(
          <ol key={`ol-${i}`} className="list-decimal ml-8 my-6 space-y-2">
            {items.map((item, idx) => (
              <li key={idx} className="text-foreground/90 leading-relaxed">
                {item}
              </li>
            ))}
          </ol>
        );
        continue;
      }
      // Horizontal rule
      else if (line.match(/^---\s*$/)) {
        elements.push(<Separator key={i} className="my-10" />);
      }
      // Regular paragraph
      else {
        elements.push(
          <p key={i} className="text-foreground/90 leading-relaxed mb-6 text-lg">
            {line}
          </p>
        );
      }

      i++;
    }

    return elements;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ReadingProgress />
      <ReadingProgressBar />
      <Header />

      <main className="flex-1">
        <article>
          {/* Hero Section */}
          <div className="relative">
            <div className="h-[40vh] md:h-[60vh] w-full overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            </div>

            <div className="container relative -mt-24 md:-mt-32">
              <div className="max-w-3xl mx-auto bg-background/80 backdrop-blur-sm rounded-t-2xl p-6 md:p-10 shadow-xl">
                <Link to="/" className="inline-block mb-6">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <Link to={`/category/${post.category.toLowerCase().replace(/\s+&\s+/g, '-')}`}>
                    <Badge className="text-sm px-4 py-1">{post.category}</Badge>
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

                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
                  {post.title}
                </h1>

                <div className="flex items-center justify-between flex-wrap gap-6">
                  <Link to={`/author/${post.author.id}`} className="flex items-center gap-4 group">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-14 w-14 rounded-full object-cover ring-4 ring-background"
                    />
                    <div>
                      <p className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {post.author.name}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => dispatch(togglePostLike(post.id))}
                    >
                      <Heart
                        className={`h-5 w-5 ${isLiked ? 'fill-primary text-primary' : ''}`}
                      />
                      <span className="absolute -top-2 -right-2 text-xs font-bold bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
                        {post.likes}
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => dispatch(toggleBookmark(post.id))}
                    >
                      <Bookmark
                        className={`h-5 w-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`}
                      />
                    </Button>

                    <ShareButtons url={window.location.href} title={post.title} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container py-12">
            <div className="max-w-3xl mx-auto">
              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-10">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-4 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* AI Summary */}
              <AISummary postId={post.id} content={post.content} />

              {/* Article Body */}
              <div className="prose prose-lg max-w-none dark:prose-invert mt-10">
                {formatContent(post.content)}
              </div>

              {/* Author Bio Card */}
              <div className="mt-16 p-8 bg-muted/50 rounded-2xl border">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <Link to={`/author/${post.author.id}`}>
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-24 w-24 rounded-full object-cover ring-4 ring-background"
                    />
                  </Link>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">Written by</p>
                    <Link to={`/author/${post.author.id}`}>
                      <h3 className="text-2xl font-bold hover:text-primary transition-colors">
                        {post.author.name}
                      </h3>
                    </Link>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {post.author.bio}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="mt-16">
                <CommentSection postId={post.id} />
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="container py-16 border-t">
            <h2 className="font-display text-3xl font-bold mb-8">Related Articles</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="container py-16">
          <NewsletterCTA />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PostDetail;