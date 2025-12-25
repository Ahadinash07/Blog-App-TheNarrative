import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Search, Menu, X, Bookmark, Home, Grid3X3, Flame, History, Users, Info, LucideIcon, PenSquare, LogOut, User, BarChart3, Settings } from 'lucide-react';

interface NavLink {
  path: string;
  label: string;
  icon: LucideIcon;
  count?: number;
}
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchQuery, logoutUser } from '@/store/blogSlice';
import ThemeToggle from '@/components/ThemeToggle';
import CreatePostModal from '@/components/CreatePostModal';
import NotificationDropdown from '@/components/NotificationDropdown';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.blog.searchQuery);
  const bookmarkedPosts = useAppSelector((state) => state.blog.user.bookmarkedPosts);
  const currentUser = useAppSelector((state) => state.blog.currentUser);
  const isAuthenticated = useAppSelector((state) => state.blog.isAuthenticated);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);

  const navLinks: NavLink[] = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/popular', label: 'Popular', icon: Flame },
    { path: '/categories', label: 'Categories', icon: Grid3X3 },
    { path: '/authors', label: 'Writers', icon: Users },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark, count: bookmarkedPosts.length },
  ];

  const mobileExtraLinks: NavLink[] = [
    { path: '/history', label: 'History', icon: History },
    { path: '/about', label: 'About', icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-foreground">
              The<span className="text-primary">Narrative</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.label}
                  {link.count !== undefined && link.count > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {link.count}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center gap-2 animate-scale-in">
                  <Input
                    type="search"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    className="w-64"
                    autoFocus
                  />
                  <Button variant="ghost" size="icon" onClick={() => { setIsSearchOpen(false); dispatch(setSearchQuery('')); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Link to="/search">
                  <Button variant="ghost" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>

            {isAuthenticated && (
              <Button variant="ghost" size="icon" onClick={() => setCreatePostOpen(true)} className="hidden sm:flex">
                <PenSquare className="h-4 w-4" />
              </Button>
            )}

            {isAuthenticated && <NotificationDropdown />}

            <ThemeToggle />

            {isAuthenticated && currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5">
                    <p className="font-medium text-sm">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCreatePostOpen(true)}>
                    <PenSquare className="mr-2 h-4 w-4" />
                    Create Post
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookmarks"><Bookmark className="mr-2 h-4 w-4" />Bookmarks</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/history"><History className="mr-2 h-4 w-4" />Reading History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => dispatch(logoutUser())} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                <Link to="/register"><Button size="sm" className="btn-glow">Sign Up</Button></Link>
              </div>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="search" placeholder="Search..." value={searchQuery} onChange={(e) => dispatch(setSearchQuery(e.target.value))} className="pl-10" />
                  </div>
                  {!isAuthenticated && (
                    <div className="flex gap-2">
                      <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}><Button variant="outline" className="w-full">Sign In</Button></Link>
                      <Link to="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}><Button className="w-full">Sign Up</Button></Link>
                    </div>
                  )}
                  <nav className="flex flex-col gap-1">
                    {[...navLinks, ...mobileExtraLinks].map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 text-base font-medium transition-colors rounded-lg ${isActive(link.path) ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                          <Icon className="h-5 w-5" />{link.label}
                          {link.count !== undefined && link.count > 0 && <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{link.count}</span>}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <CreatePostModal open={createPostOpen} onClose={() => setCreatePostOpen(false)} />
    </>
  );
};

export default Header;
