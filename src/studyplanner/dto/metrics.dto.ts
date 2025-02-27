import { IsNumber } from 'class-validator';

export class MetricsDto {
  @IsNumber()
  totalHours: number;

  @IsNumber()
  efficiencyScore: number;

  @IsNumber()
  dailyAverage: number;

  @IsNumber()
  completionPercentage: number;
}