import { PartialType } from '@nestjs/mapped-types';
import { CreateStudyPlanDto } from './create-study-plan.dto';
import { IsString } from 'class-validator';

export class UpdateStudyPlanDto extends PartialType(CreateStudyPlanDto) {
  @IsString()
  id: string;
}