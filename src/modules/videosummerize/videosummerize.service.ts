import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { OpenAI } from 'openai';
import { ConfigService } from '@nestjs/config';
import { YoutubeTranscript } from 'youtube-transcript'; // Install this library

@Injectable()
export class VideosummerizeService {
    private openAiKey: string;
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        this.openAiKey = this.configService.get<string>('OPENAI_API_KEY', '');

        if (!this.openAiKey) {
            throw new HttpException('OpenAI API key is missing', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        this.openai = new OpenAI({ apiKey: this.openAiKey });
    }

    async getVideoTranscript(videoUrl: string): Promise<any> {
        try {
            const videoId = this.extractVideoId(videoUrl);
    
            if (!videoId) {
                throw new HttpException('Invalid video URL or video ID not found', HttpStatus.BAD_REQUEST);
            }
    
            console.log(`Fetching transcript for video ID: ${videoId}`);
    
            // Use youtube-transcript library to fetch the transcript
            const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    
            if (!transcript || transcript.length === 0) {
                console.warn('No transcript data found for this video.');
                throw new HttpException('Video transcript not found', HttpStatus.NOT_FOUND);
            }
    
            // Calculate duration for each segment
            const transcriptWithDuration = transcript.map((entry, index, array) => {
                const nextEntry = array[index + 1];
                const duration = nextEntry ? nextEntry.offset - entry.offset : null; // Calculate duration based on the next segment's offset
                return {
                    text: entry.text,
                    start: entry.offset, // Start time of the segment
                    end: nextEntry ? nextEntry.offset : entry.offset + (duration || 0), // End time of the segment
                    duration: duration || 0, // Duration of the segment
                };
            });
    
            console.log('Transcript fetched successfully');
            console.log('Transcript JSON:', JSON.stringify(transcriptWithDuration, null, 2)); // Pretty-print JSON
            return transcriptWithDuration; // Return the JSON array with correct timestamps
        } catch (error) {
            console.error('Error fetching video transcript:', error.message || error.response?.data);
            throw new HttpException('Failed to fetch video transcript', HttpStatus.NOT_FOUND);
        }
    }

    async summarizeText(text: string): Promise<string> {
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo', // Use GPT-3.5 if GPT-4 is unavailable
                messages: [
                    { role: 'system', content: 'You are an AI that summarizes text in 5 sentences.' },
                    { role: 'user', content: `Summarize the following text in 5 sentences:\n\n${text}` },
                ],
                max_tokens: 200,
            });
    
            if (response.choices && response.choices.length > 0) {
                return response.choices[0]?.message?.content || 'No summary available.';
            }
    
            throw new Error('No summary generated');
        } catch (error) {
            console.error('Error summarizing text:', error.response?.data || error.message || error);
    
            // Handle quota exceeded error
            if (error.response?.status === 429) {
                throw new HttpException(
                    'You have exceeded your OpenAI API quota. Please check your plan and billing details.',
                    HttpStatus.TOO_MANY_REQUESTS,
                );
            }
    
            throw new HttpException('Failed to generate summary.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private extractVideoId(url: string): string {
        const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        return match ? match[1] : '';
    }
}