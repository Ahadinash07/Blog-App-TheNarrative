import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { GamificationDashboard } from '@/components/GamificationDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Trophy, Target, TrendingUp, Zap } from 'lucide-react';

const GamificationPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Level 8 Reader</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Your Reading Journey
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
              Turn reading into a rewarding adventure. Earn badges, maintain streaks, and become a legendary reader!
            </p>
          </div>

          {/* Quick Stats - Beautiful Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-300/50 dark:border-orange-700/50">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent" />
              <CardContent className="relative p-8 text-center">
                <Flame className="h-14 w-14 mx-auto mb-4 text-orange-500 drop-shadow-lg" />
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-4xl font-bold text-orange-600 dark:text-orange-400 mt-2">7 days</p>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mt-2">On fire! Keep going 🔥</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-300/50 dark:border-yellow-700/50">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent" />
              <CardContent className="relative p-8 text-center">
                <Trophy className="h-14 w-14 mx-auto mb-4 text-yellow-500 drop-shadow-lg" />
                <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">14 / 22</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mt-2">Elite Reader Status</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-300/50 dark:border-emerald-700/50">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent" />
              <CardContent className="relative p-8 text-center">
                <Target className="h-14 w-14 mx-auto mb-4 text-emerald-500 drop-shadow-lg" />
                <p className="text-sm font-medium text-muted-foreground">Monthly Goal</p>
                <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">82%</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-2">Crushing it! 🎯</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-300/50 dark:border-purple-700/50">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent" />
              <CardContent className="relative p-8 text-center">
                <TrendingUp className="h-14 w-14 mx-auto mb-4 text-purple-500 drop-shadow-lg" />
                <p className="text-sm font-medium text-muted-foreground">Total Reading</p>
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mt-2">52h</p>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mt-2">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard */}
          <GamificationDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GamificationPage;