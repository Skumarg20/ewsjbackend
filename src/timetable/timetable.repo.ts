import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeTable } from '../../entities/timetable.entity';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';


@Injectable()
export class TimeTableRepository {
    constructor(
        @InjectRepository(TimeTable)
        private readonly TimeTableRepo: Repository<TimeTable>
    ) {}

    /** 🔹 Create Note for a Specific User */
    async createTimeTable(userId: string, createTimetableDto: CreateTimetableDto): Promise<TimeTable | any> {
        const timeTable = this.TimeTableRepo.create({
            ...createTimetableDto,
            user: { id: userId }, // ✅ Correct way to assign a user
        });
    
        return await this.TimeTableRepo.save(timeTable);
    }


    async getAllTimeTableByUser(userId: string): Promise<TimeTable[]> {
        return await this.TimeTableRepo.find({ where: { user: { id: userId } } });
    }


    async getTimeTableById(userId: string, noteId: string): Promise<TimeTable | null> {
        return await this.TimeTableRepo.findOne({ where: { id: noteId, user: { id: userId } } });
    }

  
    async updateTimeTable(userId: string, TimeTableId: string, updateNoteDto: UpdateTimetableDto): Promise<TimeTable | null> {
        const note = await this.getTimeTableById(userId, TimeTableId);
        if (!note) throw new NotFoundException('Note not found for this user');

        Object.assign(note, updateNoteDto);
        return await this.TimeTableRepo.save(note);
    }

   
    async deleteTimeTable(userId: string, noteId: string): Promise<boolean> {
        const note = await this.getTimeTableById(userId, noteId);
        if (!note) throw new NotFoundException('Note not found for this user');

        const result = await this.TimeTableRepo.delete(noteId);
        return (result.affected ?? 0) > 0;
    }
}
