import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { TimeTable } from '../../entities/timetable.entity';
import { TimeTableRepository } from './timetable.repo';

@Module({
    imports: [TypeOrmModule.forFeature([TimeTable])],
    controllers: [TimetableController],
    providers: [TimetableService,TimeTableRepository],
})
export class TimetableModule {}
