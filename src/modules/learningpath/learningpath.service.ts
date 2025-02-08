import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LearningpathService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const openAiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!openAiKey) {
      throw new HttpException('OpenAI API key is missing', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    this.openai = new OpenAI({ apiKey: openAiKey });
  }

  async generateLearningPath(query: string, time: string, subject: string, chapter: string): Promise<string> {
    const prompt = `You are an expert IIT JEE and NEET tutor. A student has the following query:
      - Query: ${query}
      - Time Availability: ${time}
      - Subject: ${subject}
      - Chapter: ${chapter}

      Generate a detailed and personalized learning path for the student. Include the following:
      1. A step-by-step study plan.
      2. Recommended resources (books, videos, etc.).
      3. Practice tips and strategies.
      4. Time management advice.`;

    return this.callOpenAIWithRetry(prompt);
  }


  private async callOpenAIWithRetry(prompt: string): Promise<string> {
    const maxRetries = 5;
    let attempt = 0;
    const delay = 2000; // wait for 2 seconds before retrying

    while (attempt < maxRetries) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo', // Or gpt-3.5-turbo if you prefer
          messages: [{ role: 'user', content: prompt }],
          // Adjust max_tokens as needed.  A good starting point is often 200-500, not 67 unless you want very short responses.
          max_tokens: 400, // Example: Increased for more detailed responses
        });

        if (!response || !response.choices || !response.choices[0]?.message?.content) {
          console.error("Invalid OpenAI Response:", response); // Log the full response for debugging
          throw new HttpException('Invalid response from OpenAI', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return response.choices[0].message.content;
      } catch (error) {
        console.error("OpenAI API Error (Attempt ${attempt + 1}):", error.message || error.response?.data); // More detailed error logging

        if (error.response && error.response.status === 429) {
          console.log('Rate limit exceeded, retrying...');
          attempt++;
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Important:  Re-throw the error after logging if it's NOT a rate limit error
          throw error; 
        }
      }
    }

    throw new Error('Max retries reached for OpenAI request');
  }
}