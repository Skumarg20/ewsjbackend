import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTimeTableDto {
    
  @IsNotEmpty()
  @IsString()
  date?: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  study_hours: number;

  @IsOptional()
  quote?: string;

  @IsOptional()
  schedule?: any[];
}

export class UpdateSessionDto {
  @IsBoolean()
  completed: boolean;
}
