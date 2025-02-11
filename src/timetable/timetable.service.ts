import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeTable } from '../../entities/timetable.entity';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { TimeTableRepository } from './timetable.repo';
import { time } from 'console';

@Injectable()
export class TimetableService {
   constructor (private readonly timeTableRepository:TimeTableRepository){}

   
   async create(userId: string, createTimetableDto: CreateTimetableDto): Promise<TimeTable | any> {
    return await this.timeTableRepository.createTimeTable(userId, createTimetableDto); 
}
    

  
    async findAll(userId:string): Promise<TimeTable[]> {
        return this.timeTableRepository.getAllTimeTableByUser(userId);
    }

  
    async findOne(id: string, userId: string): Promise<TimeTable> {
        const timetable = await this.timeTableRepository.getTimeTableById(userId,id);
        if (!timetable) throw new NotFoundException('Timetable not found');
        return timetable;
    }

    
    async update(id: string, userId: string, updateTimetableDto: UpdateTimetableDto): Promise<TimeTable|any> {
        return this.timeTableRepository.updateTimeTable(userId,id,updateTimetableDto);
    }

   
    // async remove(id: string, userId: 'uuid'): Promise<void> {
    //     const timetable = await this.findOne(id, userId);
    //     await this.timetableRepository.remove(timetable);
    // }
}
