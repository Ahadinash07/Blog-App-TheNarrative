import { useState, useEffect, useCallback } from 'react';
import { X, Image, Video, FileText, Link2, Bold, Italic, List, Quote, Code, Save, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addPost, saveDraft, loadDraft, deleteDraft } from '@/store/blogSlice';
import { useToast } from '@/hooks/use-toast';

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

const CreatePostModal = ({ open, onClose }: CreatePostModalProps) => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.blog.categories);
  const currentUser = useAppSelector(state => state.blog.currentUser);
  const drafts = useAppSelector(state => state.blog.user.drafts);
  const { toast } = useToast();

  const editorTools = [
    { icon: Bold, label: 'Bold', action: () => insertFormat('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertFormat('*', '*') },
    { icon: List, label: 'List', action: () => insertFormat('\n- ', '') },
    { icon: Quote, label: 'Quote', action: () => insertFormat('\n> ', '') },
    { icon: Code, label: 'Code', action: () => insertFormat('`', '`') },
    { icon: Link2, label: 'Link', action: () => insertFormat('[', '](url)') },
  ];

  const insertFormat = (before: string, after: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
      setContent(newContent);
    }
  };

  const handleMediaUpload = (type: 'image' | 'video') => {
    // Simulate media upload - in real app would open file picker
    const placeholders = {
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      video: 'https://example.com/video.mp4',
    };
    if (type === 'image') {
      setCoverImage(placeholders.image);
      toast({ title: 'Image added', description: 'Cover image has been set.' });
    }
  };

  const handleSubmit = async () => {
    if (!title || !content || !category) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in title, content, and category.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    dispatch(addPost({
      id: `post-${Date.now()}`,
      title,
      slug,
      excerpt: excerpt || content.substring(0, 150) + '...',
      content,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
      author: currentUser ? {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        bio: '',
        postsCount: 1,
        followersCount: 0,
      } : {
        id: 'guest',
        name: 'Guest Author',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
        bio: '',
        postsCount: 1,
        followersCount: 0,
      },
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      publishedAt: new Date().toISOString(),
      readingTime: Math.ceil(content.split(' ').length / 200),
      featured: false,
      trending: false,
      likes: 0,
      views: 0,
    }));

    toast({ title: 'Post published!', description: 'Your post is now live.' });
    setIsLoading(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setExcerpt('');
    setContent('');
    setCategory('');
    setTags('');
    setCoverImage('');
    setCurrentDraftId(null);
  };

  const saveDraft = useCallback(() => {
    if (!title.trim() && !content.trim()) {
      toast({ title: 'Nothing to save', description: 'Please add some content before saving.' });
      return;
    }

    const draftData = {
      id: currentDraftId || `draft-${Date.now()}`,
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      coverImage: coverImage.trim(),
      lastModified: new Date().toISOString(),
    };

    dispatch(saveDraft(draftData));
    setCurrentDraftId(draftData.id);

    toast({ title: 'Draft saved!', description: 'Your draft has been saved.' });
  }, [title, content, excerpt, category, tags, coverImage, currentDraftId, dispatch, toast]);

  const loadDraftFromStore = (draft: Post) => {
    setTitle(draft.title || '');
    setExcerpt(draft.excerpt || '');
    setContent(draft.content || '');
    setCategory(draft.category || '');
    setTags(draft.tags?.join(', ') || '');
    setCoverImage(draft.coverImage || '');
    setCurrentDraftId(draft.id);

    toast({ title: 'Draft loaded', description: 'Your draft has been loaded.' });
  };

  const deleteDraftFromStore = (draftId: string) => {
    dispatch(deleteDraft(draftId));
    if (currentDraftId === draftId) {
      resetForm();
    }
    toast({ title: 'Draft deleted', description: 'Your draft has been deleted.' });
  };

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!open) return;

    const autoSaveInterval = setInterval(() => {
      if (title.trim() || content.trim()) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [title, content, excerpt, category, tags, coverImage, open, saveDraft]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display text-2xl">Create New Post</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={saveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              {drafts.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Load Draft
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {drafts.map((draft) => (
                      <DropdownMenuItem
                        key={draft.id}
                        onClick={() => loadDraftFromStore(draft)}
                        className="flex items-center justify-between"
                      >
                        <span className="truncate max-w-[200px]">{draft.title || 'Untitled Draft'}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDraftFromStore(draft.id);
                          }}
                          className="ml-2 h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          {currentDraftId && (
            <p className="text-sm text-muted-foreground">
              Currently editing draft: {drafts.find(d => d.id === currentDraftId)?.title || 'Untitled'}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Cover Image</Label>
            {coverImage ? (
              <div className="relative rounded-lg overflow-hidden">
                <img src={coverImage} alt="Cover" className="w-full h-48 object-cover" />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => setCoverImage('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => handleMediaUpload('image')}>
                    <Image className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                  <Button variant="outline" onClick={() => handleMediaUpload('video')}>
                    <Video className="mr-2 h-4 w-4" />
                    Add Video
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Or paste an image URL below
                </p>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="mt-2 max-w-md mx-auto"
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter your post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-display"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt (optional)</Label>
            <Textarea
              id="excerpt"
              placeholder="A brief summary of your post..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
            />
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/50">
                {editorTools.map((tool, i) => (
                  <Button key={i} variant="ghost" size="sm" onClick={tool.action} className="h-8 w-8 p-0">
                    <tool.icon className="h-4 w-4" />
                  </Button>
                ))}
                <div className="flex-1" />
                <Button variant="ghost" size="sm" onClick={() => handleMediaUpload('image')}>
                  <Image className="h-4 w-4 mr-1" />
                  Insert Media
                </Button>
              </div>
              <Textarea
                id="content"
                placeholder="Write your content in Markdown..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="border-0 rounded-none focus-visible:ring-0"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Supports Markdown formatting. Use **bold**, *italic*, `code`, and more.
            </p>
          </div>

          {/* Category & Tags */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="react, javascript, tutorial"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate tags with commas</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => toast({ title: 'Draft saved' })}>
              <FileText className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="btn-glow">
              {isLoading ? 'Publishing...' : 'Publish Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
