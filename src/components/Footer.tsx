import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { subscribeToNewsletter } from '@/store/blogSlice';
import { toast } from '@/hooks/use-toast';

const Footer = () => {
  const dispatch = useAppDispatch();
  const isSubscribed = useAppSelector((state) => state.blog.user.subscribedToNewsletter);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      dispatch(subscribeToNewsletter(email));
      setEmail('');
      toast({
        title: 'Welcome aboard! 🎉',
        description: 'You\'ve successfully subscribed to our newsletter.',
      });
    }
  };

  const footerLinks = {
    explore: [
      { label: 'Home', path: '/' },
      { label: 'Categories', path: '/categories' },
      { label: 'Trending', path: '/?filter=trending' },
      { label: 'Featured', path: '/?filter=featured' },
    ],
    categories: [
      { label: 'Technology', path: '/category/technology' },
      { label: 'Design', path: '/category/design' },
      { label: 'Programming', path: '/category/programming' },
      { label: 'AI & ML', path: '/category/ai-ml' },
    ],
    resources: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl font-bold text-foreground">
                The<span className="text-primary">Narrative</span>
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-sm">
              Discover insightful articles on technology, design, and development. 
              Join our community of curious minds.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-display text-sm font-semibold text-foreground mb-3">
                Subscribe to our newsletter
              </h4>
              {isSubscribed ? (
                <p className="text-sm text-primary flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">✓</span>
                  You're subscribed!
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="max-w-[240px]"
                  />
                  <Button type="submit" size="default">
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TheNarrative. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
