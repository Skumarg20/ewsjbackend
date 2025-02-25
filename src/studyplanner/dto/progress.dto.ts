import { IsArray, IsNumber, IsDate, IsString } from 'class-validator';

export class ProgressDto {
  @IsArray()
  @IsString({ each: true })
  completedItems: string[];

  @IsNumber()
  hoursSpent: number;

  @IsDate()
  lastUpdated: Date;
}