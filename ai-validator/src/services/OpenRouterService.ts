export interface AIResponse {
  content: string;
  error?: string;
}

type MessageContent = string | Array<{
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}>;

export class OpenRouterService {
  private static API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
  private static API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private static MODEL = import.meta.env.VITE_AI_MODEL || 'openai/gpt-oss-120b:free';

  static async generateCompletion(
    messages: { role: 'user' | 'system' | 'assistant'; content: MessageContent }[],
    temperature: number = 0.7,
    maxTokens: number = 1000
  ): Promise<AIResponse> {
    if (!this.API_KEY) {
      return {
        content: '',
        error: 'Missing API Key. Please add VITE_OPENROUTER_API_KEY to your .env file.',
      };
    }

    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'HTTP-Referer': import.meta.env.VITE_SITE_URL || 'http://localhost:5173', // Required by OpenRouter
          'X-Title': import.meta.env.VITE_SITE_NAME || 'AI Validator Game', // Optional
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: messages,
          temperature: temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          content: '',
          error: errorData.error?.message || `API Error: ${response.status}`,
        };
      }

      const data = await response.json();
      console.log('OpenRouter API Response:', data); // Debug logging

      if (!data.choices || data.choices.length === 0) {
         return {
           content: '',
           error: 'No choices returned from API',
         };
      }

      return {
        content: data.choices[0]?.message?.content || '',
      };
    } catch (error) {
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}
