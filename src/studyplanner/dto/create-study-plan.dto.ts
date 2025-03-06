import { PlanType } from '../../../entities/studyplan.entity';
import { Type } from 'class-transformer';
import { 
  IsArray, 
  IsDate, 
  IsNumber, 
  IsString, 
  ValidateNested, 
  IsBoolean,
  IsOptional 
} from 'class-validator';
import { BaseStudyPlanDto } from './base-study-plan.dto';

export class WeeklyPlanDataDto {
  @IsArray()
  @IsString({ each: true })
  dailyPlan: string[];

  @IsNumber()
  dailyHours: number;

  @IsArray()
  @IsString({ each: true })
  subjects: string[];

  @IsArray()
  @IsString({ each: true })
  chapters: string[];

  @IsString()
  @IsOptional()
  schoolSchedule?: string;
}

export class TargetPlanDataDto {
  @IsArray()
  @IsString({ each: true })
  dailyPlan: string[];

  @IsArray()
  @IsString({ each: true })
  subjects: string[];

  
  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @IsArray()
  @IsString({ each: true })
  chapters: string[];

  @IsNumber()
  dailyHours: number;

  @IsBoolean()
  existingCommitments: boolean;

  @IsArray()
  @IsString({ each: true })
  milestones: string[];
}

export class CustomPlanDataDto {
  @IsString()
  content: string;
}

export class CreateStudyPlanDto  {
  @ValidateNested()
  @Type(() => Object, {
    discriminator: {
      property: 'planType',
      subTypes: [
        { name: PlanType.WEEKLY, value: WeeklyPlanDataDto },
        { name: PlanType.TARGET, value: TargetPlanDataDto },
        { name: PlanType.CUSTOM, value: CustomPlanDataDto },
      ],
    },
  })
  data: WeeklyPlanDataDto | TargetPlanDataDto | CustomPlanDataDto;
}
export class CustomStudyPlanDto{
  content:string;
}