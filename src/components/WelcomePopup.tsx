import { useState, useEffect } from 'react';
import { X, Sparkles, Gift, Bell, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface WelcomePopupProps {
  open: boolean;
  onClose: () => void;
}

const WelcomePopup = ({ open, onClose }: WelcomePopupProps) => {
  const features = [
    { icon: Gift, title: 'Exclusive Content', description: 'Access premium articles and tutorials' },
    { icon: Bell, title: 'Personalized Feed', description: 'Get content tailored to your interests' },
    { icon: Users, title: 'Join Community', description: 'Connect with fellow readers and writers' },
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <div className="relative bg-gradient-to-br from-primary/20 via-accent/10 to-background p-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="animate-bounce mb-4 inline-block">
            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            Welcome to TheNarrative
          </h2>
          <p className="text-muted-foreground mb-6">
            Discover stories that inspire, educate, and transform.
          </p>

          <div className="grid gap-4 mb-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-card/50 backdrop-blur text-left animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <Button onClick={onClose} className="flex-1 btn-glow">
              Get Started
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomePopup;
