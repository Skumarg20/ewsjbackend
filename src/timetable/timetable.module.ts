import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { TimeTable } from '../../entities/timetable.entity';
import { TimeTableRepository } from './timetable.repo';
import { StudySession } from 'entities/StudySession';
import { RateLimitService } from 'src/rate-limit/rate-limit.service';
import { RateLimitGuard } from 'src/rate-limit/rate-limit.guard';

@Module({
    imports: [TypeOrmModule.forFeature([TimeTable,StudySession])],
    controllers: [TimetableController],
    providers: [TimetableService,TimeTableRepository,RateLimitService,RateLimitGuard],
})
export class TimetableModule {}
