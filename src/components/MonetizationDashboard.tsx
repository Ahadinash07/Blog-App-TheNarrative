import { useState } from 'react';
import { Crown, Star, Check, CreditCard, Lock, Unlock, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAppSelector } from '@/store/hooks';
import { useToast } from '@/hooks/use-toast';

interface PremiumContentProps {
  isPremium?: boolean;
  previewContent?: string;
  fullContent?: string;
  onUpgrade?: () => void;
}

const PremiumContentGate = ({ isPremium, previewContent, fullContent, onUpgrade }: PremiumContentProps) => {
  if (isPremium) {
    return <div dangerouslySetInnerHTML={{ __html: fullContent || '' }} />;
  }

  return (
    <div className="space-y-4">
      <div dangerouslySetInnerHTML={{ __html: previewContent || '' }} />

      <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center bg-primary/5">
        <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Premium Content</h3>
        <p className="text-muted-foreground mb-4">
          Unlock the full article and access exclusive content with a premium subscription.
        </p>
        <Button onClick={onUpgrade} className="flex items-center gap-2">
          <Crown className="h-4 w-4" />
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );
};

const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 9.99,
      period: 'month',
      features: [
        'Unlimited article access',
        'Ad-free reading experience',
        'Early access to new content',
        'Download articles for offline',
        'Priority customer support'
      ],
      popular: false,
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 89.99,
      period: 'year',
      originalPrice: 119.88,
      features: [
        'All Monthly features',
        '2 months free',
        'Exclusive premium articles',
        'Monthly author Q&A sessions',
        'Custom reading recommendations',
        'Export reading analytics'
      ],
      popular: true,
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: 299.99,
      period: 'one-time',
      features: [
        'All Yearly features',
        'Lifetime access',
        'VIP community access',
        'Direct author messaging',
        'Custom content requests',
        'Remove all limitations'
      ],
      popular: false,
    },
  ];

  const handleSubscribe = (planId: string) => {
    // In a real app, this would integrate with a payment processor
    toast({
      title: 'Subscription initiated',
      description: `Redirecting to payment for ${planId} plan...`,
    });

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: 'Payment successful!',
        description: 'Welcome to premium! Your subscription is now active.',
      });
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
            </div>
          )}

          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              {plan.name}
            </CardTitle>
            <div className="space-y-2">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              {plan.originalPrice && (
                <div className="text-sm text-muted-foreground line-through">
                  ${plan.originalPrice}/{plan.period}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full"
              variant={plan.popular ? 'default' : 'outline'}
              onClick={() => handleSubscribe(plan.id)}
            >
              Subscribe Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const EarningsDashboard = () => {
  const user = useAppSelector((state) => state.blog.currentUser);

  // Mock earnings data
  const earnings = {
    total: 2847.50,
    thisMonth: 423.80,
    lastMonth: 389.20,
    pending: 156.40,
    monthlyData: [
      { month: 'Jan', amount: 245.50 },
      { month: 'Feb', amount: 289.30 },
      { month: 'Mar', amount: 312.80 },
      { month: 'Apr', amount: 345.20 },
      { month: 'May', amount: 389.20 },
      { month: 'Jun', amount: 423.80 },
    ]
  };

  if (!user || user.role !== 'author') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${earnings.total.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${earnings.thisMonth.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${earnings.pending.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">+15.2%</p>
                <p className="text-sm text-muted-foreground">Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Monthly Goal Progress</span>
              <span className="text-sm text-muted-foreground">$500 / $500</span>
            </div>
            <Progress value={100} className="h-2" />
            <p className="text-xs text-muted-foreground">Goal reached! 🎉</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MonetizationDashboard = () => {
  const user = useAppSelector((state) => state.blog.currentUser);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          Premium & Monetization
        </h1>
        <p className="text-lg text-muted-foreground">
          Unlock premium features and monetize your content
        </p>
      </div>

      <Tabs defaultValue="subscription" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subscription">Subscription Plans</TabsTrigger>
          <TabsTrigger value="earnings">Earnings Dashboard</TabsTrigger>
          <TabsTrigger value="settings">Premium Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="space-y-6">
          <SubscriptionPlans />
        </TabsContent>

        <TabsContent value="earnings" className="space-y-6">
          <EarningsDashboard />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Premium Content Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Premium Content</Label>
                  <p className="text-sm text-muted-foreground">Allow subscribers to access exclusive content</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Paywall After</Label>
                  <p className="text-sm text-muted-foreground">Show paywall after X paragraphs</p>
                </div>
                <select className="px-3 py-1 border rounded">
                  <option>3 paragraphs</option>
                  <option>5 paragraphs</option>
                  <option>7 paragraphs</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { MonetizationDashboard, PremiumContentGate, SubscriptionPlans, EarningsDashboard };