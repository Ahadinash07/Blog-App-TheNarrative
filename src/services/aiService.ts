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

class AIService {
  async generateSummary(content: string, options: AISummaryOptions = {}): Promise<string> {
    const { maxLength = 150, style = 'concise' } = options;

    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      // Fallback to mock implementation
      return this.generateMockSummary(content, maxLength);
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

  private generateMockSummary(content: string, maxLength: number): string {
    // Extract first few sentences as a simple summary
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const summaryLength = Math.min(3, Math.ceil(sentences.length / 3));
    return sentences.slice(0, summaryLength).join('. ').trim() + '.';
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