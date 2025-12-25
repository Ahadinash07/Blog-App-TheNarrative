import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { WritingAssistant } from '@/components/WritingAssistant';
import { Card, CardContent } from '@/components/ui/card';
import { PenTool, Sparkles, FileText, Search } from 'lucide-react';

const WritingAssistantPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight">
              AI Writing Assistant
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Leverage AI to create better blog content, optimize for SEO, and improve your writing
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-10">
                <PenTool className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold">Content Outlines</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Generate structured outlines for your blog posts
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-10">
                <Search className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold">SEO Optimization</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Create optimized titles, descriptions, and keywords
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-10">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold">Writing Tips</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Get AI-powered suggestions to improve your content
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-10">
                <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold">Content Analysis</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Analyze readability, sentiment, and content quality
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Assistant */}
          <WritingAssistant />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WritingAssistantPage;