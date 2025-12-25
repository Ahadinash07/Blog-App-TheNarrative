import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Wand2, FileText, Search, Lightbulb } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

interface WritingAssistantProps {
  onContentGenerated?: (content: string) => void;
}

export const WritingAssistant: React.FC<WritingAssistantProps> = ({ onContentGenerated }) => {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [outline, setOutline] = useState<string[]>([]);
  const [seoTags, setSeoTags] = useState<{ keywords: string[]; description: string; title: string } | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]); // ← FIXED: missing state
  const [savedDrafts, setSavedDrafts] = useState<Array<{ id: string; title: string; content: string; timestamp: string }>>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('outline'); // ← FIXED: missing state
  const [isLoading, setIsLoading] = useState(false); // ← FIXED: missing state
  const { toast } = useToast();

  // Load saved drafts on mount
  useEffect(() => {
    const drafts = localStorage.getItem('writingAssistantDrafts');
    if (drafts) {
      setSavedDrafts(JSON.parse(drafts));
    }
  }, []);

  const saveDraft = () => {
    if (!content.trim() && !topic.trim()) {
      toast({
        title: 'Nothing to Save',
        description: 'Please enter some content or topic before saving.',
        variant: 'destructive',
      });
      return;
    }

    const draft = {
      id: currentDraftId || Date.now().toString(),
      title: topic || 'Untitled Draft',
      content: content,
      timestamp: new Date().toISOString()
    };

    const updatedDrafts = currentDraftId
      ? savedDrafts.map(d => d.id === currentDraftId ? draft : d)
      : [draft, ...savedDrafts];

    setSavedDrafts(updatedDrafts);
    localStorage.setItem('writingAssistantDrafts', JSON.stringify(updatedDrafts));
    setCurrentDraftId(draft.id);

    toast({
      title: 'Draft Saved',
      description: 'Your work has been saved successfully.',
    });
  };

  const loadDraft = (draft: { id: string; title: string; content: string; timestamp: string }) => {
    setTopic(draft.title);
    setContent(draft.content);
    setCurrentDraftId(draft.id);
    setActiveTab('outline');
    toast({
      title: 'Draft Loaded',
      description: `Loaded "${draft.title}"`,
    });
  };

  const deleteDraft = (draftId: string) => {
    const updatedDrafts = savedDrafts.filter(d => d.id !== draftId);
    setSavedDrafts(updatedDrafts);
    localStorage.setItem('writingAssistantDrafts', JSON.stringify(updatedDrafts));

    if (currentDraftId === draftId) {
      setCurrentDraftId(null);
      setTopic('');
      setContent('');
    }

    toast({
      title: 'Draft Deleted',
      description: 'Draft has been removed.',
    });
  };

  const exportContent = () => {
    if (!content.trim()) {
      toast({
        title: 'No Content',
        description: 'Please generate or enter some content to export.',
        variant: 'destructive',
      });
      return;
    }

    const exportData = {
      title: topic || 'Untitled',
      content: content,
      outline: outline,
      seoTags: seoTags,
      suggestions: suggestions,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(topic || 'writing-assistant').replace(/\s+/g, '-').toLowerCase()}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Content Exported',
      description: 'Your content has been exported as JSON.',
    });
  };

  const generateOutline = async () => {
    if (!topic.trim()) {
      toast({ title: 'Topic Required', description: 'Please enter a topic.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const generatedOutline = await aiService.generateContentOutline(topic, 'medium');
      setOutline(generatedOutline);
      setActiveTab('outline');
      toast({ title: 'Outline Generated', description: 'Your content outline is ready!' });
    } catch (error) {
      toast({ title: 'Generation Failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSEOTags = async () => {
    if (!content.trim() || !topic.trim()) {
      toast({ title: 'Content Required', description: 'Please enter both topic and content.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const tags = await aiService.generateSEOTags(content, topic);
      setSeoTags(tags);
      setActiveTab('seo');
      toast({ title: 'SEO Tags Generated', description: 'Your SEO metadata is ready!' });
    } catch (error) {
      toast({ title: 'Generation Failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSuggestions = async () => {
    if (!content.trim()) {
      toast({ title: 'Content Required', description: 'Please enter some content.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const writingSuggestions = await aiService.generateWritingSuggestions(content);
      setSuggestions(writingSuggestions);
      setActiveTab('suggestions');
      toast({ title: 'Suggestions Generated', description: 'Your writing tips are ready!' });
    } catch (error) {
      toast({ title: 'Generation Failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeContent = () => {
    if (!content.trim()) {
      toast({ title: 'Content Required', description: 'Please enter some content to analyze.', variant: 'destructive' });
      return;
    }

    const analysis = aiService.analyzeContent(content);
    setActiveTab('analysis');

    toast({
      title: 'Content Analyzed',
      description: `${analysis.readingTime} min read • ${analysis.difficulty} • ${analysis.sentiment}`,
    });
  };

  return (
    <div className="space-y-8">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Wand2 className="h-7 w-7 text-primary" />
            AI Writing Assistant
          </CardTitle>
          <CardDescription className="text-base">
            Get AI-powered help with creating and optimizing your blog content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Blog Post Topic</Label>
              <Input
                id="topic"
                placeholder="e.g. The Future of AI in 2026"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={generateOutline} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <FileText className="h-5 w-5 mr-2" />}
                Generate Outline
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Content</Label>
            <Textarea
              id="content"
              placeholder="Write or paste your blog post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={generateSEOTags} disabled={isLoading} variant="secondary">
              <Search className="h-4 w-4 mr-2" /> Generate SEO Tags
            </Button>
            <Button onClick={generateSuggestions} disabled={isLoading} variant="secondary">
              <Lightbulb className="h-4 w-4 mr-2" /> Writing Suggestions
            </Button>
            <Button onClick={analyzeContent} variant="secondary">
              📊 Analyze Content
            </Button>
            <Button onClick={saveDraft} variant="outline">
              💾 Save Draft
            </Button>
            <Button onClick={exportContent} variant="outline">
              📤 Export JSON
            </Button>
          </div>

          {/* Saved Drafts Preview */}
          {savedDrafts.length > 0 && (
            <div className="space-y-2">
              <Label>Recent Drafts</Label>
              <div className="flex flex-wrap gap-2">
                {savedDrafts.slice(0, 6).map((draft) => (
                  <div key={draft.id} className="flex items-center gap-1 bg-muted px-3 py-2 rounded-lg text-sm">
                    <button
                      onClick={() => loadDraft(draft)}
                      className="hover:text-primary transition-colors"
                    >
                      {draft.title}
                    </button>
                    <button
                      onClick={() => deleteDraft(draft.id)}
                      className="text-destructive hover:bg-destructive/10 rounded px-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="outline">Outline</TabsTrigger>
          <TabsTrigger value="seo">SEO Tags</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        {/* All Tabs Content (unchanged, just safer) */}
        <TabsContent value="outline" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Content Outline</CardTitle></CardHeader>
            <CardContent>
              {outline.length > 0 ? (
                <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                  {outline.map((section, i) => (
                    <li key={i} className="pl-2"><span className="text-foreground font-medium">{section}</span></li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground text-center py-8">Generate an outline using the topic above.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-6">
          <Card>
            <CardHeader><CardTitle>SEO Metadata</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {seoTags ? (
                <>
                  <div><Label>SEO Title</Label><p className="mt-1 font-medium">{seoTags.title}</p><p className="text-xs text-muted-foreground">{seoTags.title.length} characters</p></div>
                  <div><Label>Meta Description</Label><p className="mt-1">{seoTags.description}</p><p className="text-xs text-muted-foreground">{seoTags.description.length} characters</p></div>
                  <div><Label>Keywords</Label><div className="flex flex-wrap gap-2 mt-2">
                    {seoTags.keywords.map((kw, i) => (<Badge key={i} variant="secondary">{kw}</Badge>))}
                  </div></div>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-8">Generate SEO tags using your content.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Writing Suggestions</CardTitle></CardHeader>
            <CardContent>
              {suggestions.length > 0 ? (
                <ul className="space-y-3">
                  {suggestions.map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-center py-8">Get AI suggestions for your content.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Content Analysis</CardTitle></CardHeader>
            <CardContent>
              {content.trim() ? (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-3">Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <p>Words: <span className="font-medium">{content.split(/\s+/).filter(w => w).length}</span></p>
                      <p>Reading Time: <span className="font-medium">{aiService.analyzeContent(content).readingTime} min</span></p>
                      <p>Difficulty: <span className="font-medium">{aiService.analyzeContent(content).difficulty}</span></p>
                      <p>Sentiment: <span className="font-medium">{aiService.analyzeContent(content).sentiment}</span></p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {aiService.analyzeContent(content).topics.map((t, i) => (
                        <Badge key={i} variant="outline">{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Enter content to analyze.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Saved Drafts</CardTitle></CardHeader>
            <CardContent>
              {savedDrafts.length > 0 ? (
                <div className="space-y-4">
                  {savedDrafts.map((draft) => (
                    <div key={draft.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                      <div>
                        <h4 className="font-medium">{draft.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(draft.timestamp).toLocaleString()} • {draft.content.length} characters
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => loadDraft(draft)}>Load</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteDraft(draft.id)}>Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-12">No drafts saved yet. Start writing!</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};