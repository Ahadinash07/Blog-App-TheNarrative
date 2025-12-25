import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

export interface AISummaryOptions {
  maxLength?: number;
  style?: 'concise' | 'detailed' | 'bullet-points';
}

export interface AIRecommendationOptions {
  userHistory: string[];
  availablePosts: Array<{ id: string; title: string; tags: string[]; category: string }>;
  count?: number;
}

export interface ContentAnalysis {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  readingTime: number;
  keyPoints: string[];
}

export interface SmartSearchResult {
  postId: string;
  relevance: number;
  matchedTerms: string[];
  context: string;
}

class AIService {
  // Client-side AI features (no API required)
  analyzeContentDifficulty(content: string): 'beginner' | 'intermediate' | 'advanced' {
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;

    // Complex words (words > 6 characters)
    const complexWords = content.split(/\s+/).filter(word =>
      word.length > 6 && !['however', 'therefore', 'although', 'because', 'through', 'should', 'would', 'could'].includes(word.toLowerCase())
    ).length;

    const complexityScore = (complexWords / words) * 100 + (avgWordsPerSentence - 15) * 2;

    if (complexityScore < 15) return 'beginner';
    if (complexityScore < 25) return 'intermediate';
    return 'advanced';
  }

  extractTopics(content: string): string[] {
    const commonTopics = [
      'JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'AI', 'Machine Learning',
      'Web Development', 'Mobile', 'Design', 'UX', 'UI', 'Database', 'API', 'Security',
      'Performance', 'Testing', 'DevOps', 'Cloud', 'Blockchain', 'IoT', 'Gaming'
    ];

    const contentLower = content.toLowerCase();
    return commonTopics.filter(topic =>
      contentLower.includes(topic.toLowerCase()) ||
      contentLower.includes(topic.toLowerCase().replace(' ', ''))
    ).slice(0, 5);
  }

  analyzeSentiment(content: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'brilliant', 'perfect', 'love', 'like', 'best', 'impressive'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'dislike', 'poor', 'weak', 'fail', 'error', 'problem', 'issue'];

    const words = content.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  extractKeyPoints(content: string): string[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const keyPoints: string[] = [];

    // Look for sentences with important keywords
    const importantKeywords = ['important', 'key', 'main', 'primary', 'essential', 'crucial', 'significant', 'notable', 'remember', 'note'];

    sentences.forEach(sentence => {
      const sentenceLower = sentence.toLowerCase();
      if (importantKeywords.some(keyword => sentenceLower.includes(keyword)) ||
          sentence.split(/\s+/).length > 15) {
        keyPoints.push(sentence.trim());
      }
    });

    return keyPoints.slice(0, 5);
  }

  smartSearch(query: string, posts: Array<{ id: string; title: string; content: string; tags: string[]; category: string }>): SmartSearchResult[] {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);

    return posts.map(post => {
      let relevance = 0;
      const matchedTerms: string[] = [];
      const context: string[] = [];

      // Title matching (highest weight)
      const titleLower = post.title.toLowerCase();
      queryWords.forEach(word => {
        if (titleLower.includes(word)) {
          relevance += 10;
          matchedTerms.push(word);
          context.push(`Title: ${post.title}`);
        }
      });

      // Content matching
      const contentLower = post.content.toLowerCase();
      queryWords.forEach(word => {
        const count = (contentLower.match(new RegExp(word, 'g')) || []).length;
        relevance += count * 2;
        if (count > 0) {
          matchedTerms.push(word);
          // Find context around the word
          const index = contentLower.indexOf(word);
          if (index !== -1) {
            const start = Math.max(0, index - 50);
            const end = Math.min(contentLower.length, index + 50);
            context.push(`Content: ...${contentLower.substring(start, end)}...`);
          }
        }
      });

      // Tag matching
      post.tags.forEach(tag => {
        const tagLower = tag.toLowerCase();
        queryWords.forEach(word => {
          if (tagLower.includes(word)) {
            relevance += 5;
            matchedTerms.push(word);
            context.push(`Tag: ${tag}`);
          }
        });
      });

      // Category matching
      const categoryLower = post.category.toLowerCase();
      queryWords.forEach(word => {
        if (categoryLower.includes(word)) {
          relevance += 3;
          matchedTerms.push(word);
          context.push(`Category: ${post.category}`);
        }
      });

      return {
        postId: post.id,
        relevance,
        matchedTerms: [...new Set(matchedTerms)],
        context: [...new Set(context)]
      };
    }).filter(result => result.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);
  }

  generateReadingTips(content: string): string[] {
    const analysis = this.analyzeContent(content);
    const tips: string[] = [];

    if (analysis.difficulty === 'advanced') {
      tips.push('This is an advanced topic - take your time reading through complex sections');
    }

    if (analysis.sentiment === 'positive') {
      tips.push('This content has a positive tone - enjoy the optimistic perspective!');
    }

    if (analysis.keyPoints.length > 3) {
      tips.push('This article covers many important points - consider taking notes');
    }

    if (analysis.readingTime > 10) {
      tips.push('This is a longer read - consider breaking it into multiple sessions');
    }

    tips.push(`Estimated reading time: ${analysis.readingTime} minutes`);
    tips.push(`Content difficulty: ${analysis.difficulty}`);

    return tips;
  }

  analyzeContent(content: string): ContentAnalysis {
    return {
      difficulty: this.analyzeContentDifficulty(content),
      topics: this.extractTopics(content),
      sentiment: this.analyzeSentiment(content),
      readingTime: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)), // 200 words per minute
      keyPoints: this.extractKeyPoints(content)
    };
  }

  async generateSummary(content: string, options: AISummaryOptions = {}): Promise<string> {
    const { maxLength = 150, style = 'concise' } = options;

    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      // Enhanced mock implementation
      return this.generateMockSummary(content, maxLength, style);
    }

    try {
      const prompt = `Please provide a ${style} summary of the following article in ${maxLength} words or less. Focus on the main points and key takeaways:

${content.substring(0, 4000)}`; // Limit content length

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise, accurate summaries of articles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.3,
      });

      return completion.choices[0]?.message?.content?.trim() || 'Summary unavailable';
    } catch (error) {
      console.error('AI Summary generation failed:', error);
      return this.generateMockSummary(content, maxLength);
    }
  }

  async generateRecommendations(options: AIRecommendationOptions): Promise<string[]> {
    const { userHistory, availablePosts, count = 5 } = options;

    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      // Fallback to simple recommendation logic
      return this.generateMockRecommendations(userHistory, availablePosts, count);
    }

    try {
      const userHistoryTitles = availablePosts
        .filter(post => userHistory.includes(post.id))
        .map(post => post.title)
        .join(', ');

      const availableTitles = availablePosts
        .filter(post => !userHistory.includes(post.id))
        .map(post => `${post.title} (tags: ${post.tags.join(', ')}, category: ${post.category})`)
        .join('\n');

      const prompt = `Based on a user who has read these articles: ${userHistoryTitles}

From this list of available articles, recommend ${count} most relevant ones:

${availableTitles}

Return only the article titles, one per line, in order of relevance.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a recommendation engine that suggests relevant articles based on reading history.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.5,
      });

      const recommendations = completion.choices[0]?.message?.content
        ?.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0) || [];

      // Map back to post IDs
      return recommendations
        .map(title => {
          const post = availablePosts.find(p => p.title.toLowerCase().includes(title.toLowerCase()));
          return post?.id;
        })
        .filter(Boolean) as string[];
    } catch (error) {
      console.error('AI Recommendations failed:', error);
      return this.generateMockRecommendations(userHistory, availablePosts, count);
    }
  }

  async analyzeReadingDifficulty(content: string): Promise<'beginner' | 'intermediate' | 'advanced'> {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      // Simple heuristic-based analysis
      return this.analyzeDifficultyHeuristically(content);
    }

    try {
      const prompt = `Analyze the reading difficulty of this article content and classify it as 'beginner', 'intermediate', or 'advanced'. Consider vocabulary complexity, technical terms, and conceptual depth.

Content: ${content.substring(0, 2000)}

Return only one word: beginner, intermediate, or advanced.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing text difficulty for educational purposes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 10,
        temperature: 0.1,
      });

      const difficulty = completion.choices[0]?.message?.content?.trim().toLowerCase();
      return ['beginner', 'intermediate', 'advanced'].includes(difficulty || '')
        ? difficulty as 'beginner' | 'intermediate' | 'advanced'
        : this.analyzeDifficultyHeuristically(content);
    } catch (error) {
      console.error('AI Difficulty analysis failed:', error);
      return this.analyzeDifficultyHeuristically(content);
    }
  }

  private generateMockSummary(content: string, maxLength: number, style: string = 'concise'): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);

    if (style === 'bullet-points') {
      const keyPoints = this.extractKeyPoints(content);
      return keyPoints.map(point => `• ${point}`).join('\n');
    }

    if (style === 'detailed') {
      const summaryLength = Math.min(5, Math.ceil(sentences.length / 2));
      return sentences.slice(0, summaryLength).join('. ').trim() + '.';
    }

    // concise style
    const summaryLength = Math.min(2, Math.ceil(sentences.length / 4));
    return sentences.slice(0, summaryLength).join('. ').trim() + '.';
  }

  // New AI-powered features
  async generateWritingSuggestions(content: string): Promise<string[]> {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      return this.generateMockWritingSuggestions(content);
    }

    try {
      const prompt = `Analyze this blog post content and provide 3-5 specific writing improvement suggestions. Focus on clarity, engagement, structure, and SEO:

${content.substring(0, 3000)}

Return suggestions as a numbered list.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a writing coach specializing in blog content optimization.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.4,
      });

      return completion.choices[0]?.message?.content
        ?.split('\n')
        .map(line => line.trim())
        .filter(line => line.match(/^\d+\./)) || this.generateMockWritingSuggestions(content);
    } catch (error) {
      console.error('Writing suggestions failed:', error);
      return this.generateMockWritingSuggestions(content);
    }
  }

  async generateSEOTags(content: string, title: string): Promise<{ keywords: string[]; description: string; title: string }> {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      return this.generateMockSEOTags(content, title);
    }

    try {
      const prompt = `Generate SEO-optimized metadata for this blog post:

Title: ${title}
Content: ${content.substring(0, 2000)}

Provide:
1. SEO title (50-60 characters)
2. Meta description (150-160 characters)
3. 5-7 relevant keywords

Format as JSON with keys: title, description, keywords (array)`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert that creates optimized metadata for blog posts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content?.trim();
      if (response) {
        try {
          const parsed = JSON.parse(response);
          return {
            title: parsed.title || title,
            description: parsed.description || content.substring(0, 155),
            keywords: Array.isArray(parsed.keywords) ? parsed.keywords : []
          };
        } catch {
          return this.generateMockSEOTags(content, title);
        }
      }
      return this.generateMockSEOTags(content, title);
    } catch (error) {
      console.error('SEO tags generation failed:', error);
      return this.generateMockSEOTags(content, title);
    }
  }

  async generateContentOutline(topic: string, targetLength: 'short' | 'medium' | 'long' = 'medium'): Promise<string[]> {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      return this.generateMockContentOutline(topic, targetLength);
    }

    try {
      const lengthGuide = {
        short: '3-5 main sections',
        medium: '5-8 main sections',
        long: '8-12 main sections'
      };

      const prompt = `Create a detailed content outline for a blog post about "${topic}". The outline should be comprehensive and include ${lengthGuide[targetLength]}.

Return only the section headings, one per line, without numbering.`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a content strategist that creates detailed outlines for blog posts.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.5,
      });

      return completion.choices[0]?.message?.content
        ?.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0) || this.generateMockContentOutline(topic, targetLength);
    } catch (error) {
      console.error('Content outline generation failed:', error);
      return this.generateMockContentOutline(topic, targetLength);
    }
  }

  // Mock implementations for when API is not available
  private generateMockWritingSuggestions(content: string): string[] {
    const suggestions = [
      'Consider adding more specific examples to illustrate your points',
      'Use shorter paragraphs to improve readability',
      'Add transition sentences between major sections',
      'Include a clear call-to-action at the end',
      'Consider adding subheadings to break up long sections'
    ];

    // Return 3 random suggestions
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  private generateMockSEOTags(content: string, title: string): { keywords: string[]; description: string; title: string } {
    const topics = this.extractTopics(content);
    const firstSentence = content.split(/[.!?]/)[0]?.trim() || '';

    return {
      title: title.length > 60 ? title.substring(0, 57) + '...' : title,
      description: firstSentence.length > 160 ? firstSentence.substring(0, 157) + '...' : firstSentence,
      keywords: topics.slice(0, 7)
    };
  }

  private generateMockContentOutline(topic: string, targetLength: 'short' | 'medium' | 'long'): string[] {
    const outlines = {
      short: [
        'Introduction',
        'Main Concepts',
        'Practical Examples',
        'Conclusion'
      ],
      medium: [
        'Introduction',
        'Background and Context',
        'Core Concepts',
        'Implementation Steps',
        'Best Practices',
        'Common Challenges',
        'Conclusion'
      ],
      long: [
        'Introduction',
        'Historical Context',
        'Current State of the Field',
        'Core Principles',
        'Detailed Implementation',
        'Advanced Techniques',
        'Case Studies',
        'Performance Considerations',
        'Future Trends',
        'Conclusion',
        'Resources and Further Reading'
      ]
    };

    return outlines[targetLength];
  }

  private generateMockRecommendations(
    userHistory: string[],
    availablePosts: Array<{ id: string; title: string; tags: string[]; category: string }>,
    count: number
  ): string[] {
    // Simple recommendation based on categories and tags
    const readPosts = availablePosts.filter(post => userHistory.includes(post.id));
    const preferredCategories = [...new Set(readPosts.map(p => p.category))];
    const preferredTags = [...new Set(readPosts.flatMap(p => p.tags))];

    const recommendations = availablePosts
      .filter(post => !userHistory.includes(post.id))
      .map(post => ({
        id: post.id,
        score: (
          preferredCategories.includes(post.category) ? 2 : 0) +
          post.tags.filter(tag => preferredTags.includes(tag)).length
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(item => item.id);

    return recommendations;
  }

  private analyzeDifficultyHeuristically(content: string): 'beginner' | 'intermediate' | 'advanced' {
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = words / sentences;

    // Technical terms (rough heuristic)
    const technicalTerms = ['algorithm', 'framework', 'api', 'database', 'server', 'component', 'function', 'class'].length;
    const technicalDensity = technicalTerms / words;

    if (avgWordsPerSentence > 25 || technicalDensity > 0.01) return 'advanced';
    if (avgWordsPerSentence > 15 || technicalDensity > 0.005) return 'intermediate';
    return 'beginner';
  }
}

export const aiService = new AIService();