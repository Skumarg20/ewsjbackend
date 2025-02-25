import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { StudyPlanInputDto } from './dto/studyplanner.dto';

import { Repository } from 'typeorm';
import { StudyPlan } from 'entities/studyplan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TargetPlanDataDto, WeeklyPlanDataDto } from './dto/create-study-plan.dto';
import { PlanType } from 'entities/studyplan.entity';
@Injectable()
export class StudyPlanService {
 
  private geminiApiUrl :string;
  private apiKey: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(StudyPlan)
    private studyPlanRepository: Repository<StudyPlan>,

  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const geminiApiUrl=this.configService.get<string>('GEMINI_API_URL');
    if (!apiKey || !geminiApiUrl) {
      throw new Error('keys are not defined in the configuration');
    }
    this.apiKey = apiKey;
    this.geminiApiUrl=geminiApiUrl;

      
  }
  

  async generatePlan(studyPlanInputDto: StudyPlanInputDto): Promise<any> {
  
   
    const targetTopics: string[] = studyPlanInputDto.target || [];
    const exam: string = studyPlanInputDto.exam || '';
    const dailyHours: number = studyPlanInputDto.dailyHours || 0; 
    const subjects: string[] = studyPlanInputDto.subject || [];  
    const studentType: string = studyPlanInputDto.studentType || 'school';
    const chapters: string[] = studyPlanInputDto.chapters || [];  
    const dueDate:string=studyPlanInputDto.duedate ||'';

    const targetString: string = targetTopics.length > 0 ? targetTopics.join(', ') : '';
    const chaptersString: string = chapters.length > 0 ? chapters.join(', ') : '';
  
    try {
      const prompt = `
      I am a student preparing for an exam based on the following dynamic form data provided from a "Create Study DTO":
  
      Form Data:
      - target: '${targetString}' (a string describing my weekly or targetd goal, e.g., "Master all chapters" – use this if provided, otherwise default to "Cover all chapters effectively"),
      - exam: '${exam}' (the name of the exam, e.g., "Chemistry Final" – use this if provided, otherwise default to "Unnamed Exam"),
      - chapters: '${chaptersString}' (a comma-separated string of chapters, e.g., "Atoms, Molecules, Reactions" – split into an array; if empty, default to ["Chapter 1"]),
      - dailyHours: '${dailyHours}' (a number as a string, e.g., "2" – convert to a number; if empty or 0, default to 2 hours),
      - studentType: '${studentType}' (fixed as a daily school-going student with a school schedule of 8 AM to 3 PM unless overridden).
      if due date is given
      -due_date:'${dueDate}' (generate a study plan for this due date and target is already given and make it easy and efficitive to use).
  
      Using this dynamic form data, create a perfect study plan for one week in JSON format that helps me achieve my target and succeed in my exam. The response must follow this DTO structure:
      in weeklyPlanDataDto response add due date and divide target till that due date and also make days like that start to due date divide all the target for those days
      export class WeeklyPlanDataDto { 
        @IsArray() @IsString({ each: true }) dailyPlan: string[]; 
        @IsNumber() dailyHours: number; 
        @IsArray() @IsString({ each: true }) subjects: string[]; 
        @IsArray() @IsString({ each: true }) chapters: string[]; 
        @IsString() @IsOptional() schoolSchedule?: string; 
      }
     
      Instructions:
      - Use '${targetString}' as the target goal. If empty, default to "Cover all chapters effectively".
      - Use '${exam}' as the exam name. If empty, default to "Unnamed Exam" and assume subjects as ["General Studies"].
      - Parse '${chaptersString}' as a comma-separated string into an array (e.g., "Atoms, Molecules" becomes ["Atoms", "Molecules"]). If empty, use ["Chapter 1"].
      - Convert '${dailyHours}' to a number. If empty or 0, default to 2 hours.
      - Since '${studentType}' is typically "school", assume a school schedule of 8 AM to 3 PM, scheduling study time after school (e.g., 4 PM onward) unless overridden.
      - Divide the daily study hours efficiently across the chapters, creating specific tasks for 'dailyPlan' (e.g., "Day 1: 4-5 PM - Read Atoms (1 hr)").
      - Use provided subjects if available (${subjects.length > 0 ? `'${subjects.join(', ')}'` : 'inferred from exam'}), otherwise infer from '${exam}' (e.g., "Chemistry Final" implies ["Chemistry"]). If unclear, use ["General Studies"].
      - Ensure the plan covers all chapters by the end of the week, with time for review if feasible.
      - Return the response in JSON format matching the WeeklyPlanDataDto structure.
    `;
  
   
    console.log(prompt);
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
  
  async generateTargetStudyPlan(targetPlanDataDto: TargetPlanDataDto): Promise<TargetPlanDataDto> {
    const {
      dailyHours: inputDailyHours,
      chapters: inputChapters,
      subjects: inputSubjects,
      dueDate: inputDueDate,
      existingCommitments,
      milestones: inputMilestones,
    } = targetPlanDataDto;

    
    const dailyHours = inputDailyHours || 2;
    const chapters = inputChapters.length > 0 ? inputChapters : ['Chapter 1'];
    const subjects = inputSubjects.length > 0 ? inputSubjects : ['General Studies'];
    const dueDate = inputDueDate ? new Date(inputDueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const targetString = inputMilestones.length > 0 ? inputMilestones.join(', ') : 'Master all chapters efficiently';
    const schoolSchedule = existingCommitments ? '8 AM - 3 PM (with additional commitments)' : '8 AM - 3 PM';

    
    const today = new Date();
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysUntilDue = Math.max(Math.ceil(timeDiff / (1000 * 3600 * 24)), 1);

    try {
      const prompt = `
🚀 **Mission: Craft the Ultimate Study Plan!** 🚀

Greetings, Study Commander! Your mission is to forge an epic, battle-ready study plan based on this intel from the "Create Study DTO" war room:

**Mission Intel:**
- 🎯 **Target Objective:** '${targetString}'  
  *(The grand goal! If blank, assume "Master all chapters efficiently" and lead us to victory!)*
- 📚 **Chapters to Conquer:** '${chapters.join(', ')}'  
  *(A comma-separated arsenal of topics. Split into an array. If empty, deploy "Chapter 1"!)*
- 🧠 **Subjects in Play:** '${subjects.join(', ')}'  
  *(Our core disciplines. If none listed, default to "General Studies"!)*
- ⏰ **Daily War Hours:** '${dailyHours}'  
  *(Hours per day. Convert to number. If 0 or missing, rally with 2 hours!)*
- 🏫 **School Ops Schedule:** '${schoolSchedule}'  
  *(School runs 8 AM - 3 PM. Plan study strikes from 4 PM onward, adjusting for commitments!)*
- 📅 **Due Date Drop:** '${dueDate.toISOString().split('T')[0]}'  
  *(The final countdown! Divide the target across ${daysUntilDue} days until this date!)*

**Your Orders:**
1. **Forge a Dynamic Plan:** Create a JSON masterpiece matching this **TargetPlanDataDto**:
   \`\`\`typescript
   export class TargetPlanDataDto {
     dailyPlan: string[];         // Epic daily missions (e.g., "Day 1: 4-5 PM - Conquer Atoms (1 hr)")
     subjects: string[];          // Our battle subjects
     dueDate: Date;               // The final deadline (ISO format)
     chapters: string[];          // Territories to dominate
     dailyHours: number;          // Hours per day
     existingCommitments: boolean;// Pre-existing ops
     milestones: string[];        // Victory checkpoints
   }
   \`\`\`
2. **Divide and Conquer:** Split '${targetString}' across ${daysUntilDue} days until '${dueDate.toISOString().split('T')[0]}'. Assign chapters dynamically!
3. **Time It Right:** With ${dailyHours} hours/day, craft precise 'dailyPlan' entries post-school (e.g., "Day X: 4-5 PM - Study [chapter] (1 hr)").
4. **Cover All Ground:** Ensure all ${chapters.length} chapters are tackled by D-Day, with review time if possible!
5. **Stay Epic:** Infuse the plan with motivational vibes—make it a heroic quest!

**Execution Directive:**
- Return the plan in JSON format, locked and loaded with the TargetPlanDataDto structure.
- Ensure all fields are populated, using defaults where intel is missing!

**Launch the Plan!** 💥
`;

      // API call to Gemini
      const response = await axios.post(
        `${this.geminiApiUrl}?key=${this.apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.candidates) {
        const responsedata = response.data.candidates[0]?.content || 'No timetable generated.';
        let jsonString = responsedata.parts[0].text;

        // Parse the JSON response and ensure it matches TargetPlanDataDto
        jsonString = jsonString
        .replace(/```json/g, '') // Remove ```json
        .replace(/```/g, '')     // Remove ```
        .trim();                 // Remove leading/trailing whitespace

      let parsedPlan: TargetPlanDataDto;
      try {
        parsedPlan = JSON.parse(jsonString) as TargetPlanDataDto;

        // Ensure dueDate is a Date object
        parsedPlan.dueDate = new Date(parsedPlan.dueDate);

        // Validate and fill missing fields with input data as fallback
        parsedPlan.dailyPlan = parsedPlan.dailyPlan || [];
        parsedPlan.subjects = parsedPlan.subjects || subjects;
        parsedPlan.chapters = parsedPlan.chapters || chapters;
        parsedPlan.dailyHours = parsedPlan.dailyHours || dailyHours;
        parsedPlan.existingCommitments = parsedPlan.existingCommitments ?? existingCommitments;
        parsedPlan.milestones = parsedPlan.milestones || (inputMilestones.length > 0 ? inputMilestones : ['Complete all chapters']);

        return parsedPlan;
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.error('Raw response:', jsonString);
        throw new Error('Invalid JSON format in API response');
      }
    }

    throw new Error('Invalid response from Gemini API');
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
      const prompt = `${doubt} - Respond as Cogni, a friendly human-like study buddy for Coginest.Focus solely on answering the doubt.`;
      const response = await axios.post(`${this.geminiApiUrl}?key=${this.apiKey}`, {
        contents: [{ parts: [{ text: prompt }] }], 
      });
  
      return response.data.candidates[0].content.parts[0];
    } catch (error: any) {
      console.error("Sorry, I can't solve your doubt for now:", error.response?.data || error.message);
      return { error: "Failed to generate study plan" };
    }
  }
   async getWeeklyStudyPlan(userId:string):Promise<StudyPlan|null>{
    const weeklyPlan = await this.studyPlanRepository
    .createQueryBuilder('studyplan')
    .where('studyplan.planType = :planType', { planType: PlanType.WEEKLY })
    .andWhere('studyplan.userId = :userId', { userId }) 
    .orderBy('studyplan.createdAt', 'DESC') 
    .getOne();

  return weeklyPlan;
                                                   
   }
   async getTargetedStudyPlan(userId:string):Promise<StudyPlan|null>{
    const targetedPlan = await this.studyPlanRepository
    .createQueryBuilder('studyplan')
    .where('studyplan.planType = :planType', { planType: PlanType.TARGET })
    .andWhere('studyplan.userId = :userId', { userId }) 
    .orderBy('studyplan.createdAt', 'DESC') 
    .getOne();

  return targetedPlan;
                                                   
   }
  async saveWeeklyStudyPlan(userId:string,studyweeklyPlanDto:WeeklyPlanDataDto):Promise<StudyPlan|undefined>{
    try {
      const weeklyStudyPlan = this.studyPlanRepository.create({
        planType: PlanType.WEEKLY,
        weeklyData: studyweeklyPlanDto,
        user: { id: userId },
      });
   console.log(weeklyStudyPlan,"this is weekly study plan created");
      return await this.studyPlanRepository.save(weeklyStudyPlan);
      
    
    } catch (error) {
      console.error('Error saving weekly study plan:', error); 
     
    }
  }

  async saveTargetedStudyPlan(userId:string,targetstudyPlanDto:TargetPlanDataDto):Promise<StudyPlan|undefined>{
    try {
      const targetStudyPlan = this.studyPlanRepository.create({
        planType: PlanType.TARGET,
        targetData: targetstudyPlanDto,
        user: { id: userId },
      });
   console.log(targetStudyPlan,"this is target study plan created");
      return await this.studyPlanRepository.save(targetStudyPlan);
      
    
    } catch (error) {
      console.error('Error saving weekly study plan:', error); 
     
    }
  }
  }
  
  
  

