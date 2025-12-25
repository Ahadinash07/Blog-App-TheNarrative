import { Link } from 'react-router-dom';
import { Bookmark, Heart, Eye, Maximize2, Clock } from 'lucide-react';
import { Post } from '@/types/blog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleBookmark, togglePostLike } from '@/store/blogSlice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import ReadingTimeEstimator from '@/components/ReadingTimeEstimator';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'horizontal' | 'compact';
  onQuickView?: () => void;
}

const PostCard = ({ post, variant = 'default', onQuickView }: PostCardProps) => {
  const dispatch = useAppDispatch();
  const bookmarkedPosts = useAppSelector((state) => state.blog.user.bookmarkedPosts);
  const likedPosts = useAppSelector((state) => state.blog.user.likedPosts);

  const isBookmarked = bookmarkedPosts.includes(post.id);
  const isLiked = likedPosts.includes(post.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleBookmark(post.id));
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(togglePostLike(post.id));
  };

  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-4 md:gap-6 card-elevated rounded-xl p-4 transition-all duration-300 hover:shadow-elevated">
        {/* Image */}
        <Link to={`/post/${post.slug}`} className="shrink-0">
          <div className="relative w-32 h-24 md:w-48 md:h-36 overflow-hidden rounded-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Content */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link to={`/category/${post.category.toLowerCase().replace(' & ', '-')}`}>
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
              </Link>
              <ReadingTimeEstimator readingTime={post.readingTime} className="text-xs" />
            </div>

            <Link to={`/post/${post.slug}`}>
              <h3 className="font-display text-base md:text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
            </Link>

            <p className="mt-1 text-sm text-muted-foreground line-clamp-2 hidden md:block">
              {post.excerpt}
            </p>
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="text-xs text-muted-foreground">{post.author.name}</span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleLike}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleBookmark}
              >
                <Bookmark
                  className={`h-4 w-4 transition-colors ${
                    isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'
                  }`}
                />
              </Button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group flex items-start gap-4 py-4 border-b border-border last:border-0">
        <Link to={`/post/${post.slug}`} className="shrink-0">
          <div className="relative w-20 h-20 overflow-hidden rounded-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link to={`/category/${post.category.toLowerCase().replace(' & ', '-')}`}>
            <Badge variant="outline" className="text-[10px] mb-1">
              {post.category}
            </Badge>
          </Link>
          <Link to={`/post/${post.slug}`}>
            <h4 className="font-display text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h4>
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
          </p>
        </div>
      </article>
    );
  }

  // Default variant
  return (
    <article className="group card-elevated rounded-xl overflow-hidden transition-all duration-300 hover:shadow-elevated">
      {/* Image */}
      <Link to={`/post/${post.slug}`} className="block relative overflow-hidden">
        <div className="aspect-[16/10] w-full">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {post.featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
          </div>
        )}
        {post.trending && !post.featured && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-accent text-accent-foreground">Trending</Badge>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Link to={`/category/${post.category.toLowerCase().replace(' & ', '-')}`}>
            <Badge variant="secondary" className="text-xs">
              {post.category}
            </Badge>
          </Link>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime} min read
          </span>
        </div>

        <Link to={`/post/${post.slug}`}>
          <h3 className="font-display text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {post.excerpt}
        </p>

        {/* Author & Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <Link
            to={`/author/${post.author.id}`}
            className="flex items-center gap-2 group/author"
          >
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-background"
            />
            <div>
              <p className="text-sm font-medium text-foreground group-hover/author:text-primary transition-colors">
                {post.author.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mr-2">
              <Eye className="h-3 w-3" />
              {post.views.toLocaleString()}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleLike}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'
                }`}
              />
              <span className="sr-only">Like</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleBookmark}
            >
              <Bookmark
                className={`h-4 w-4 transition-colors ${
                  isBookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'
                }`}
              />
              <span className="sr-only">Bookmark</span>
            </Button>
            {onQuickView && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(); }}
              >
                <Maximize2 className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Quick View</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
