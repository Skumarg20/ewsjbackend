import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeTableDto } from './create-timetable.dto';

export class UpdateTimetableDto extends PartialType(CreateTimeTableDto) {}
