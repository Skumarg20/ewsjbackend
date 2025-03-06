import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';
import { TimeTable } from '../../entities/timetable.entity';
import { CreateTimeTableDto, UpdateSessionDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { TimeTableRepository } from './timetable.repo';
import { GenerateTimetableDto } from './dto/generate-timetable.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { TimeTableResponse } from './interface/timetable.interface';
import { StudyPlanInterface } from './dto/generate-timetable.dto';
import { StudySession } from 'entities/StudySession';


@Injectable()
export class TimetableService {
  private geminiApiUrl: string;
  private apiKey: string;
  constructor(
    private readonly timeTableRepository: TimeTableRepository,
    private configService: ConfigService,
    @InjectRepository(StudySession)
    private sessionRepository: Repository<StudySession>,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const geminiApiUrl = this.configService.get<string>('GEMINI_API_URL');
    if (!apiKey || !geminiApiUrl) {
      throw new Error('keys are not defined in the configuration');
    }
    this.apiKey = apiKey;
    this.geminiApiUrl = geminiApiUrl;
  }

  
  async create(
    userId: string,
    createTimetableDto: CreateTimeTableDto,
  ): Promise<TimeTable | any> {

    
    return await this.timeTableRepository.createTimeTable(
      userId,
      createTimetableDto,
    );
  }

  async findAll(userId: string): Promise<TimeTable[]> {
    return this.timeTableRepository.getAllTimeTableByUser(userId);
  }
  async findCurrent(userId:string): Promise<TimeTableResponse|null>{
    return this.timeTableRepository.getCurrentTimeTable(userId);
  }
  async findOne(id: string): Promise<TimeTable> {
    const timetable = await this.timeTableRepository.getTimeTableById(
      id,
    );
    if (!timetable) throw new NotFoundException('Timetable not found');
    return timetable;
  }

  // async update(
  //   id: string,
  //   userId: string,
  //   updateTimetableDto: UpdateTimetableDto,
  // ): Promise<TimeTable | any> {
  //   return this.timeTableRepository.updateTimeTable(
  //     userId,
  //     id,
  //     updateTimetableDto,
  //   );
  // }

  
  async generateTimeTable(
    generateTimetableDto: GenerateTimetableDto,
  ): Promise<any> {
   
    const {
      targetExam,
      dailyRoutine,
      studyHours,
      subjects,
      priorities,
      includeBreaks,
    } = generateTimetableDto;
    try {
      const prompt = `
      Generate a study timetable for today (${new Date().toDateString()}) for a student preparing for ${targetExam}.
      - Daily Routine: ${dailyRoutine}
      - Study Hours: ${studyHours} hours
      - Subjects to Focus On: ${subjects.join(', ')}
      - Priorities: ${priorities ? JSON.stringify(priorities) : 'Default exam weightage'}
      - Include Breaks and Revision: ${includeBreaks ? 'Yes' : 'No'}
    
      The schedule should be specific to today only, well-balanced, realistic, and effective for exam preparation.
      add some good motivating line or quotes too
      return data with {
        date: string;
        title: string; into range start time to end time in 24 hours format
        description: string;
        study_hours: number;
        schedule: {
        time: string;
  subject
  topic?
  activity in acitivity in only one word like study coding work relax only there 4 (lunch dinner breakfast break will come under relax activity)
  notes? 
        }
        quote: 
      }} json format everything at any case
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
          const jsonData:StudyPlanInterface = JSON.parse(responsedata.parts[0].text.replace(/```json\n|\n```/g, ''))

         
        return {
          format: 'json',
          data: jsonData,
        };
      }
      
      throw new Error('Invalid response from Ewsj');
    } catch (error) {
      console.error(
        'Error generating timetable:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to generate timetable');
    }
  }

  async getSessions(userId:string){
   
    const sessions=await this.timeTableRepository.getSessions(userId);
    return sessions;
  }
  async getSession(sessionId:string,userId:string){
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['timeTable'], 
  });
  if (!session) {
    throw new Error('Session not found');
}
const { timeTable, ...sessionWithoutTimeTable } = session;

    return { message: "Session found successfully", session: sessionWithoutTimeTable };

  }
  async updateSession(sessionId: string, userId: string, updateSessionDto: UpdateSessionDto) {

    const session = await this.sessionRepository.findOne({
        where: { id: sessionId },
        relations: ['timeTable','timeTable.user'], 
    });


    if (!session) {
        throw new Error('Session not found');
    }

    if (!session.timeTable) {
        throw new Error('TimeTable relation not found in session');
    }
  
    if (!session.timeTable.user || session.timeTable.user.id !== userId) {
        throw new Error('Unauthorized or user mismatch');
    }

    // Proceed with the update
   await this.sessionRepository.update(sessionId, updateSessionDto);

    return { message: 'Session updated successfully'};
}


  
}
