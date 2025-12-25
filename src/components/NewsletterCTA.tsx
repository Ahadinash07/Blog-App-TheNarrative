import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { subscribeToNewsletter } from '@/store/blogSlice';
import { toast } from '@/hooks/use-toast';

interface NewsletterCTAProps {
  variant?: 'default' | 'inline';
}

const NewsletterCTA = ({ variant = 'default' }: NewsletterCTAProps) => {
  const dispatch = useAppDispatch();
  const isSubscribed = useAppSelector((state) => state.blog.user.subscribedToNewsletter);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      dispatch(subscribeToNewsletter(email));
      setEmail('');
      toast({
        title: 'Welcome to the community! 🎉',
        description: 'Check your inbox for a confirmation email.',
      });
    }
  };

  if (isSubscribed) {
    return (
      <div className={`${variant === 'default' ? 'bg-accent/10 rounded-2xl p-8 text-center' : ''}`}>
        <div className="flex items-center justify-center gap-2 text-accent">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-bold">
            ✓
          </span>
          <span className="font-medium">You're subscribed to our newsletter!</span>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubscribe} className="flex gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Subscribe</Button>
      </form>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-8 md:p-12">
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
      
      <div className="relative text-center max-w-xl mx-auto">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 mb-4">
          <Mail className="h-7 w-7 text-primary" />
        </div>
        
        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Stay in the loop
        </h3>
        <p className="mt-2 text-muted-foreground">
          Get the latest articles, tutorials, and insights delivered straight to your inbox. 
          No spam, unsubscribe anytime.
        </p>

        <form onSubmit={handleSubscribe} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 h-12"
          />
          <Button type="submit" size="lg" className="btn-glow">
            Subscribe
          </Button>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          Join 10,000+ developers. We respect your privacy.
        </p>
      </div>
    </div>
  );
};

export default NewsletterCTA;
