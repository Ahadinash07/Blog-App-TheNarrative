import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, CornerDownRight, Send, AtSign, MoreHorizontal, Flag, Edit, Trash2 } from 'lucide-react';
import { Comment } from '@/types/blog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleCommentLike, addComment, addReply, addMention } from '@/store/blogSlice';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  postId: string;
}

const CommentItem = ({
  comment,
  postId,
  isReply = false,
  onMention,
}: {
  comment: Comment;
  postId: string;
  isReply?: boolean;
  onMention?: (username: string) => void;
}) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.blog.currentUser);
  const likedComments = useAppSelector((state) => state.blog.user.likedComments);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyName, setReplyName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLiked = likedComments.includes(comment.id);
  const isAuthor = currentUser?.name === comment.author.name;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleLike = () => {
    dispatch(toggleCommentLike(comment.id));
  };

  const handleReply = () => {
    if (replyContent.trim() && replyName.trim()) {
      const mentions = extractMentions(replyContent);
      dispatch(
        addReply({
          commentId: comment.id,
          content: replyContent.trim(),
          authorName: replyName.trim(),
          postId,
        })
      );

      // Add mentions
      mentions.forEach(mention => {
        dispatch(addMention({
          commentId: comment.id,
          mentionedUser: mention,
          postId,
        }));
      });

      setReplyContent('');
      setReplyName('');
      setShowReplyForm(false);
    }
  };

  const handleEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      // In a real app, this would update the comment via API
      comment.content = editContent.trim();
      setIsEditing(false);
    }
  };

  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const handleMention = (username: string) => {
    if (showReplyForm) {
      setReplyContent(prev => prev + `@${username} `);
    }
    setShowMentions(false);
    setMentionQuery('');
  };

  const handleTextareaChange = (value: string) => {
    if (isEditing) {
      setEditContent(value);
    } else {
      setReplyContent(value);
    }

    // Check for @ mentions
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const afterAt = value.substring(lastAtIndex + 1);
      const spaceIndex = afterAt.indexOf(' ');
      const query = spaceIndex === -1 ? afterAt : afterAt.substring(0, spaceIndex);
      setMentionQuery(query);
      setShowMentions(query.length > 0);
    } else {
      setShowMentions(false);
    }
  };

  return (
    <div className={`${isReply ? 'ml-8 md:ml-12 pl-4 border-l-2 border-border' : ''}`}>
      <div className="flex gap-3">
        <img
          src={comment.author.avatar}
          alt={comment.author.name}
          className="h-10 w-10 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground">{comment.author.name}</span>
            {comment.mentions && comment.mentions.length > 0 && (
              <div className="flex items-center gap-1">
                {comment.mentions.map(mention => (
                  <Badge key={mention} variant="secondary" className="text-xs">
                    @{mention}
                  </Badge>
                ))}
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
            {isAuthor && (
              <Badge variant="outline" className="text-xs">Author</Badge>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEdit}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-foreground/90">{comment.content}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likes}</span>
            </button>
            {!isReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Reply</span>
              </button>
            )}
            {isAuthor && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onMention?.(comment.author.name)}>
                  <AtSign className="h-4 w-4 mr-2" />
                  Mention
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {!isReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Reply</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4 space-y-3 animate-slide-down">
              <Input
                placeholder="Your name"
                value={replyName}
                onChange={(e) => setReplyName(e.target.value)}
              />
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReply} disabled={!replyContent.trim() || !replyName.trim()}>
                  <Send className="h-4 w-4 mr-1" />
                  Reply
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowReplyForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} postId={postId} isReply />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentSection = ({ postId }: CommentSectionProps) => {
  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) =>
    state.blog.comments.filter((c) => c.postId === postId)
  );
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleSubmit = () => {
    if (newComment.trim() && authorName.trim()) {
      // Extract mentions from comment content
      const mentionRegex = /@(\w+)/g;
      const mentions = [];
      let match;
      while ((match = mentionRegex.exec(newComment)) !== null) {
        mentions.push(match[1]);
      }

      dispatch(
        addComment({
          postId,
          content: newComment.trim(),
          authorName: authorName.trim(),
        })
      );

      // Create mention notifications
      if (mentions.length > 0) {
        // Get the newly created comment ID (this is a simplification)
        const newCommentId = `comment-${Date.now()}`;
        dispatch(addMention({
          commentId: newCommentId,
          mentions: mentions
        }));
      }

      setNewComment('');
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h3 className="font-display text-2xl font-semibold text-foreground flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <div className="mt-6 card-elevated rounded-xl p-4 md:p-6">
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-primary font-semibold">
              {authorName ? authorName.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
          <div className="flex-1 space-y-3">
            <Input
              placeholder="Your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
            <Textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim() || !authorName.trim()}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Post Comment
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="mt-8 space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
