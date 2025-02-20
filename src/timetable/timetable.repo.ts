import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeTable } from '../../entities/timetable.entity';
import { CreateTimeTableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { StudySession } from 'entities/StudySession';


@Injectable()
export class TimeTableRepository {
    
    constructor(
        @InjectRepository(TimeTable)
        private readonly TimeTableRepo: Repository<TimeTable>,
        @InjectRepository(StudySession)
        private readonly sessionRepository:Repository<StudySession>
    ) {}

    /** 🔹 Create Note for a Specific User */
    async createTimeTable(userId: string, createTimetableDto: CreateTimeTableDto): Promise<TimeTable | any> {
        const date =  new Date().toISOString().split('T')[0];
        const dateObject = new Date(date);

        // Format to "YYYY-MM-DD"
        const formattedDate = dateObject.toISOString().split("T")[0];
        
        console.log(formattedDate);
        const timeTable = this.TimeTableRepo.create({
            ...createTimetableDto,
            date:formattedDate,
            user: { id: userId }, // ✅ Correct way to assign a user
        });
    console.log("table time",timeTable);
        return await this.TimeTableRepo.save(timeTable);
    }
    async getCurrentTimeTable(userId: string): Promise<TimeTable|null> {
        return await this.TimeTableRepo.createQueryBuilder('timetable')
             .leftJoinAndSelect('timetable.schedule', 'studySession') 
            .where('timetable.userId = :userId', { userId })
            .orderBy('timetable.updatedAt', 'DESC') 
            .getOne(); 
    }
    
    
    async getAllTimeTableByUser(userId: string): Promise<TimeTable[]> {
        return await this.TimeTableRepo.find({ where: { user: { id: userId } } });
    }

    async getSessions(userId: string): Promise<StudySession[] | any> {
         try {
           const recentTimeTable = await this.TimeTableRepo.createQueryBuilder('timetable')
             .where('timetable.userId = :userId', { userId })
             .orderBy('timetable.updatedAt', 'DESC') 
             .getOne();
          console.log(recentTimeTable,"this is recent time table");
           if (!recentTimeTable) {
             throw new Error("No recent timetable found for the user");
           }
           const sessions = await this.sessionRepository.createQueryBuilder('session')
             .where('session.timeTableId = :timeTableId', { timeTableId: recentTimeTable.id })
             .getMany();
       
           return sessions;
       
         } catch (error) {
           console.error("Error fetching sessions:", error);
           throw error;
         }
       }
    
    async getTimeTableById(id: string): Promise<TimeTable | null> {
        return await this.TimeTableRepo.findOne({
            where: {
                id: id,
            },
            relations: ['schedule']
        });
    }
    

  
    // async updateTimeTable(userId: string, TimeTableId: string, updateNoteDto: UpdateTimetableDto): Promise<TimeTable | null> {
    //     const note = await this.getTimeTableById(userId, TimeTableId);
    //     if (!note) throw new NotFoundException('Note not found for this user');

    //     Object.assign(note, updateNoteDto);
    //     return await this.TimeTableRepo.save(note);
    // }

   
    // async deleteTimeTable(userId: string, noteId: string): Promise<boolean> {
    //     const note = await this.getTimeTableById(userId, noteId);
    //     if (!note) throw new NotFoundException('Note not found for this user');

    //     const result = await this.TimeTableRepo.delete(noteId);
    //     return (result.affected ?? 0) > 0;
    // }
}
