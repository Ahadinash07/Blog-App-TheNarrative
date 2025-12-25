import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, BookOpen, Search, Filter, FolderPlus, Folder, X, Edit, Check } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleBookmark } from '@/store/blogSlice';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

type SortOption = 'recent' | 'oldest' | 'title' | 'author';
type ViewMode = 'grid' | 'list';

interface BookmarkFolder {
  id: string;
  name: string;
  postIds: string[];
  color: string;
}

interface BookmarkCardProps {
  post: Post;
  viewMode: ViewMode;
  folders: BookmarkFolder[];
  onAddToFolder: (postId: string, folderId: string) => void;
  onRemoveFromFolder: (postId: string, folderId: string) => void;
}

const BOOKMARK_FOLDERS_KEY = 'bookmark-folders';

const Bookmarks = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const bookmarkedIds = useAppSelector((state) => state.blog.user.bookmarkedPosts);
  const posts = useAppSelector((state) => state.blog.posts);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [folders, setFolders] = useState<BookmarkFolder[]>(() => {
    const saved = localStorage.getItem(BOOKMARK_FOLDERS_KEY);
    return saved ? JSON.parse(saved) : [
      { id: 'default', name: 'All Bookmarks', postIds: [], color: 'bg-blue-500' }
    ];
  });

  // Get bookmarked posts
  const allBookmarkedPosts = posts.filter((p) => bookmarkedIds.includes(p.id));

  // Filter by search
  const filteredPosts = useMemo(() => {
    let filtered = allBookmarkedPosts;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.author.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allBookmarkedPosts, searchQuery]);

  // Sort posts
  const sortedPosts = useMemo(() => {
    const sortFunctions = {
      recent: (a: Post, b: Post) => {
        const aIndex = bookmarkedIds.indexOf(a.id);
        const bIndex = bookmarkedIds.indexOf(b.id);
        return aIndex - bIndex;
      },
      oldest: (a: Post, b: Post) => {
        const aIndex = bookmarkedIds.indexOf(a.id);
        const bIndex = bookmarkedIds.indexOf(b.id);
        return bIndex - aIndex;
      },
      title: (a: Post, b: Post) => a.title.localeCompare(b.title),
      author: (a: Post, b: Post) => a.author.name.localeCompare(b.author.name),
    };

    return [...filteredPosts].sort(sortFunctions[sortBy]);
  }, [filteredPosts, sortBy, bookmarkedIds]);

  // Bookmark stats
  const bookmarkStats = useMemo(() => {
    const totalBookmarks = allBookmarkedPosts.length;
    const totalReadingTime = allBookmarkedPosts.reduce((sum, post) => sum + post.readingTime, 0);
    const avgReadingTime = totalBookmarks > 0 ? Math.round(totalReadingTime / totalBookmarks) : 0;
    const categories = [...new Set(allBookmarkedPosts.map(p => p.category))];

    return {
      totalBookmarks,
      totalReadingTime,
      avgReadingTime,
      categories: categories.length,
    };
  }, [allBookmarkedPosts]);

  const handleClearAll = () => {
    bookmarkedIds.forEach((id) => dispatch(toggleBookmark(id)));
    setShowClearConfirm(false);
    toast({
      title: 'Bookmarks cleared',
      description: 'All bookmarks have been removed.',
    });
  };

  const createFolder = (name: string, color: string) => {
    const newFolder: BookmarkFolder = {
      id: Date.now().toString(),
      name,
      postIds: [],
      color,
    };
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    localStorage.setItem(BOOKMARK_FOLDERS_KEY, JSON.stringify(updatedFolders));
  };

  const addToFolder = (postId: string, folderId: string) => {
    const updatedFolders = folders.map(folder =>
      folder.id === folderId
        ? { ...folder, postIds: [...folder.postIds, postId] }
        : folder
    );
    setFolders(updatedFolders);
    localStorage.setItem(BOOKMARK_FOLDERS_KEY, JSON.stringify(updatedFolders));
  };

  const removeFromFolder = (postId: string, folderId: string) => {
    const updatedFolders = folders.map(folder =>
      folder.id === folderId
        ? { ...folder, postIds: folder.postIds.filter(id => id !== postId) }
        : folder
    );
    setFolders(updatedFolders);
    localStorage.setItem(BOOKMARK_FOLDERS_KEY, JSON.stringify(updatedFolders));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                {bookmarkStats.totalBookmarks} saved {bookmarkStats.totalBookmarks === 1 ? 'article' : 'articles'}
              </p>
            </div>

            {bookmarkStats.totalBookmarks > 0 && (
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FolderPlus className="h-4 w-4 mr-2" />
                      New Folder
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Folder</DialogTitle>
                    </DialogHeader>
                    <CreateFolderForm onCreate={createFolder} />
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={() => setShowClearConfirm(true)} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Bookmark Stats */}
        {bookmarkStats.totalBookmarks > 0 && (
          <section className="container pb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{bookmarkStats.totalBookmarks}</div>
                  <div className="text-sm text-muted-foreground">Total Bookmarks</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{bookmarkStats.totalReadingTime}m</div>
                  <div className="text-sm text-muted-foreground">Reading Time</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{bookmarkStats.avgReadingTime}m</div>
                  <div className="text-sm text-muted-foreground">Avg per Article</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{bookmarkStats.categories}</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Folders */}
        {folders.length > 1 && (
          <section className="container pb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedFolder === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFolder('all')}
              >
                All Bookmarks
              </Button>
              {folders.slice(1).map((folder) => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? 'default' : 'outline'}
                  size="sm"
                  className="gap-2"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <div className={`w-2 h-2 rounded-full ${folder.color}`} />
                  {folder.name}
                  <Badge variant="secondary" className="ml-1">{folder.postIds.length}</Badge>
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* Filters and Search */}
        {bookmarkStats.totalBookmarks > 0 && (
          <section className="container pb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="author">Author A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Bookmarked Posts */}
        <section className="container pb-16">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-16 card-elevated rounded-xl">
              <Bookmark className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                {bookmarkStats.totalBookmarks === 0 ? 'No bookmarks yet' : 'No bookmarks match your search'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {bookmarkStats.totalBookmarks === 0
                  ? 'Save articles to read later by clicking the bookmark icon.'
                  : 'Try adjusting your search criteria.'
                }
              </p>
              {bookmarkStats.totalBookmarks === 0 ? (
                <Link to="/">
                  <Button>Browse Articles</Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }>
              {sortedPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <BookmarkCard
                    post={post}
                    viewMode={viewMode}
                    folders={folders}
                    onAddToFolder={addToFolder}
                    onRemoveFromFolder={removeFromFolder}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Clear All Confirmation */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Clear All Bookmarks?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  This action cannot be undone. All your bookmarks will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowClearConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleClearAll}
                  >
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

// Bookmark Card Component
const BookmarkCard = ({ post, viewMode, folders, onAddToFolder, onRemoveFromFolder }: BookmarkCardProps) => {
  const [showFolderMenu, setShowFolderMenu] = useState(false);

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex">
            <div className="w-32 h-24 flex-shrink-0">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link to={`/post/${post.slug}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    by {post.author.name} • {post.readingTime}m read
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFolderMenu(!showFolderMenu)}
                  >
                    <Folder className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {showFolderMenu && (
                <div className="mt-2 p-2 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Add to folder:</p>
                  <div className="flex flex-wrap gap-1">
                    {folders.slice(1).map((folder: BookmarkFolder) => (
                      <Button
                        key={folder.id}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          if (folder.postIds.includes(post.id)) {
                            onRemoveFromFolder(post.id, folder.id);
                          } else {
                            onAddToFolder(post.id, folder.id);
                          }
                          setShowFolderMenu(false);
                        }}
                      >
                        {folder.postIds.includes(post.id) ? '✓' : '+'} {folder.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative group">
      <PostCard post={post} />
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowFolderMenu(!showFolderMenu)}
          className="h-8 w-8 p-0"
        >
          <Folder className="h-4 w-4" />
        </Button>
      </div>

      {showFolderMenu && (
        <div className="absolute top-12 right-2 z-10 w-48 p-2 bg-background border rounded-lg shadow-lg">
          <p className="text-sm font-medium mb-2">Add to folder:</p>
          <div className="space-y-1">
            {folders.slice(1).map((folder: BookmarkFolder) => (
              <Button
                key={folder.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => {
                  if (folder.postIds.includes(post.id)) {
                    onRemoveFromFolder(post.id, folder.id);
                  } else {
                    onAddToFolder(post.id, folder.id);
                  }
                  setShowFolderMenu(false);
                }}
              >
                <div className={`w-2 h-2 rounded-full ${folder.color} mr-2`} />
                {folder.postIds.includes(post.id) ? '✓' : '+'} {folder.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Create Folder Form Component
const CreateFolderForm = ({ onCreate }: { onCreate: (name: string, color: string) => void }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('bg-blue-500');
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
    'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), color);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Folder Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Tech Articles"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Color</label>
        <div className="flex gap-2 mt-2">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              className={`w-6 h-6 rounded-full ${c} ${color === c ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">Create Folder</Button>
    </form>
  );
};

export default Bookmarks;
