import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Eye, Heart, Bookmark } from 'lucide-react';
import { Post } from '@/types/blog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleBookmark, togglePostLike } from '@/store/blogSlice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TrendingCardProps {
  post: Post;
  rank: number;
}

const TrendingCard = ({ post, rank }: TrendingCardProps) => {
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

  return (
    <article className="group relative flex gap-4 p-4 rounded-xl bg-gradient-to-br from-card to-card/80 border border-border/50 hover:border-primary/30 hover:shadow-elevated transition-all duration-300">
      {/* Rank Number */}
      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-display font-bold text-xl">
        {String(rank).padStart(2, '0')}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <Link to={`/category/${post.category.toLowerCase().replace(' & ', '-')}`}>
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
              {post.category}
            </Badge>
          </Link>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-accent" />
            Trending
          </span>
        </div>

        <Link to={`/post/${post.slug}`}>
          <h3 className="font-display text-base md:text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>

        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 hidden sm:block">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Link to={`/author/${post.author.id}`} className="flex items-center gap-2 hover:text-foreground transition-colors">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-6 w-6 rounded-full object-cover ring-2 ring-background"
              />
              <span className="hidden sm:inline">{post.author.name}</span>
            </Link>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime} min
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.views.toLocaleString()}
            </span>
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

      {/* Thumbnail */}
      <Link to={`/post/${post.slug}`} className="hidden md:block flex-shrink-0">
        <div className="relative w-32 h-24 overflow-hidden rounded-lg">
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
    </article>
  );
};

export default TrendingCard;
