import { Link } from 'react-router-dom';
import { X, Clock, Eye, Heart, Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/types/blog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleBookmark, togglePostLike } from '@/store/blogSlice';

interface QuickViewPopupProps {
  post: Post | null;
  open: boolean;
  onClose: () => void;
}

const QuickViewPopup = ({ post, open, onClose }: QuickViewPopupProps) => {
  const dispatch = useAppDispatch();
  const bookmarkedPosts = useAppSelector(state => state.blog.user.bookmarkedPosts);
  const likedPosts = useAppSelector(state => state.blog.user.likedPosts);

  if (!post) return null;

  const isBookmarked = bookmarkedPosts.includes(post.id);
  const isLiked = likedPosts.includes(post.id);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[90vh]">
        <div className="relative">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-56 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-background transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <Badge className="absolute top-4 left-4">{post.category}</Badge>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[50vh]">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTime} min read
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views.toLocaleString()} views
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground leading-tight">
            {post.title}
          </h2>

          <p className="text-muted-foreground">{post.excerpt}</p>

          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-foreground">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button
                variant={isLiked ? 'default' : 'outline'}
                size="sm"
                onClick={() => dispatch(togglePostLike(post.id))}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {post.likes}
              </Button>
              <Button
                variant={isBookmarked ? 'default' : 'outline'}
                size="sm"
                onClick={() => dispatch(toggleBookmark(post.id))}
              >
                <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
            <Link to={`/post/${post.slug}`} onClick={onClose}>
              <Button className="btn-glow">Read Full Article</Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewPopup;
