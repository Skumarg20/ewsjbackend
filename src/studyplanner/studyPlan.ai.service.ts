import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { DurationUnit, StudyPlanInputDto } from './dto/studyplanner.dto';
import {parseText} from "../timetable/parseData"

@Injectable()
export class StudyPlanService {
  private geminiApiUrl :string;
  private apiKey: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const geminiApiUrl=this.configService.get<string>('GEMINI_API_URL');
    if (!apiKey || !geminiApiUrl) {
      throw new Error('keys are not defined in the configuration');
    }
    this.apiKey = apiKey;
    this.geminiApiUrl=geminiApiUrl;
  }
  

  async generatePlan(studyPlanInputDto: StudyPlanInputDto): Promise<any> {
  
     console.log(studyPlanInputDto);

     const targetTopics = studyPlanInputDto.targetTopics || [];
const targetQuestions = studyPlanInputDto.targetQuestionsPerSubject || {};
    let totalWeeks: number;
    switch (studyPlanInputDto.durationUnit) {
      case DurationUnit.Months:
        totalWeeks = studyPlanInputDto.duration * 4; // Approx. 4 weeks in a month
        break;
      case DurationUnit.Years:
        totalWeeks = studyPlanInputDto.duration * 52; // Approx. 52 weeks in a year
        break;
      default:
        totalWeeks = studyPlanInputDto.duration; // Already in weeks
    }
  
    try {
      const prompt = `
        I am preparing for ${studyPlanInputDto.exam}, and I have ${totalWeeks} weeks left.
        I need a detailed study plan to maximize my preparation in this time.
  
        Plan Requirements:
        - Daily Schedule: How should I effectively utilize my ${studyPlanInputDto.dailyStudyHours} hours/day?
        - Weekly & Monthly Targets: Structured goals to ensure complete syllabus coverage.
        - Practice Strategy: Number of problems to solve per subject daily.
        - Mock Tests: Frequency and best approach to analyze mistakes.
        - Board Exam Balance: If I also have board exams, how can I manage both?
  
        ${targetTopics ? `- My focus areas: ${targetTopics.join(', ')}.` : ''}
        
        Practice Breakdown:
        ${Object.entries(targetQuestions)
          .map(([subject, count]) => `- ${subject} : ${count} questions/day`)
          .join('\n')}
        
        Create the best possible study plan to help me crack ${studyPlanInputDto.exam} within this time.
    
if someone entring months then give response into this format for months

      `;
  
      const response = await axios.post(
        `${this.geminiApiUrl}?key=${this.apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
      );
  
      if (response.data && response.data.candidates) {
        const responsedata =
          response.data.candidates[0]?.content || 'No timetable generated.';
          
         
        return {
          format: 'json',
          data: responsedata.parts[0].text,
        };
      }
      
      throw new Error('Invalid response from Ewsj');
    } catch (error) {
      console.error('Error generating study plan:', error.response?.data || error.message);
      throw new Error('Failed to generate study plan');
    }
  }
  
  async askDoubt(doubt: string): Promise<any> {
    try {
      if (!doubt || typeof doubt !== "string") {
        throw new Error("Invalid input: doubt must be a non-empty string.");
      }
      const prompt=`${doubt}
       response should be in text only and not more then 200 words
      `
      const response = await axios.post(`${this.geminiApiUrl}?key=${this.apiKey}`, {
        contents: [{ parts: [{ text: prompt }] }], // Ensure it's a string
      });
  
      return response.data.candidates[0].content.parts[0];
    } catch (error: any) {
      console.error("Sorry, I can't solve your doubt for now:", error.response?.data || error.message);
      return { error: "Failed to generate study plan" };
    }
  }
  
  
  
}
