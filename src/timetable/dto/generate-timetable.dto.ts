import {
    IsString,
    IsNumber,
    IsArray,
    IsBoolean,
    IsOptional,
    IsEnum,
    Min,
    Max,
    ValidateNested,
    IsNotEmpty
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  enum TimeFrame {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly'
  }
  
  class SubjectPriority {
    @IsString()
    @IsNotEmpty()
    subject: string;
  
    @IsNumber()
    @Min(1)
    @Max(100)
    weightage: number;
  }
  
  export class GenerateTimetableDto {
    @IsString()
    @IsNotEmpty()
    dailyRoutine: string;
  
    @IsNumber()
    @Min(1)
    @Max(16)
    studyHours: number;
  
    @IsString()
    @IsNotEmpty()
    targetExam: string;
  
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    subjects: string[];
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubjectPriority)
    priorities?: SubjectPriority[];

  
    @IsBoolean()
    @IsNotEmpty()
    includeBreaks: boolean;
  }
  

  export interface StudySession {
    time: string;
    subject: string;
    topic?: string;
    activity: string;
    notes?: string;
  }
  
  export interface StudyPlanInterface {
    date?: string;
    title?: string;
    description?: string;
    study_hours?: number;
    schedule?: StudySession[];
    quote?: string;
  }