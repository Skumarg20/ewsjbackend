import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { TimeTable } from '../../entities/timetable.entity';
import { TimeTableRepository } from './timetable.repo';
import { StudySession } from 'entities/StudySession';

@Module({
    imports: [TypeOrmModule.forFeature([TimeTable,StudySession])],
    controllers: [TimetableController],
    providers: [TimetableService,TimeTableRepository],
})
export class TimetableModule {}
