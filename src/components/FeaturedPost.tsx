import { Link } from 'react-router-dom';
import { Bookmark, Heart, ArrowRight, Clock } from 'lucide-react';
import { Post } from '@/types/blog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleBookmark, togglePostLike } from '@/store/blogSlice';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FeaturedPostProps {
  post: Post;
}

const FeaturedPost = ({ post }: FeaturedPostProps) => {
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
    <article className="group relative overflow-hidden rounded-2xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-foreground/20" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col justify-end min-h-[400px] md:min-h-[500px] p-6 md:p-10">
        {/* Top Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 bg-background/20 backdrop-blur-sm border-0 text-primary-foreground hover:bg-background/40"
            onClick={handleLike}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isLiked ? 'fill-primary text-primary' : ''
              }`}
            />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 bg-background/20 backdrop-blur-sm border-0 text-primary-foreground hover:bg-background/40"
            onClick={handleBookmark}
          >
            <Bookmark
              className={`h-5 w-5 transition-colors ${
                isBookmarked ? 'fill-primary text-primary' : ''
              }`}
            />
          </Button>
        </div>

        {/* Badge */}
        <div className="flex items-center gap-3 mb-4">
          <Badge className="bg-primary text-primary-foreground">Featured</Badge>
          <Link to={`/category/${post.category.toLowerCase().replace(' & ', '-')}`}>
            <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground bg-transparent hover:bg-background/20">
              {post.category}
            </Badge>
          </Link>
          <span className="text-sm text-primary-foreground/80 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readingTime} min read
          </span>
        </div>

        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight max-w-3xl">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="mt-4 text-base md:text-lg text-primary-foreground/80 max-w-2xl line-clamp-2">
          {post.excerpt}
        </p>

        {/* Author & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
          <Link
            to={`/author/${post.author.id}`}
            className="flex items-center gap-3 group/author"
          >
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-primary-foreground/30"
            />
            <div>
              <p className="text-base font-medium text-primary-foreground group-hover/author:underline">
                {post.author.name}
              </p>
              <p className="text-sm text-primary-foreground/70">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </Link>

          <Link to={`/post/${post.slug}`}>
            <Button className="group/btn gap-2 btn-glow">
              Read Article
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default FeaturedPost;
