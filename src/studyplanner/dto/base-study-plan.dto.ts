import { PlanType, PlanStatus } from '../../../entities/studyplan.entity';
import { IsEnum, IsUUID, IsDate, IsOptional, IsJSON, IsNumber, IsString, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseStudyPlanDto {
  @IsUUID()
  userId: string;

  @IsEnum(PlanType)
  planType: PlanType;

  @IsEnum(PlanStatus)
  @IsOptional()
  status?: PlanStatus;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: Date;
}