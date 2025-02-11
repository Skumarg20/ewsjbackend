import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateTimetableDto {
    @IsNotEmpty()
    @IsString()
    day: string;

    @IsNotEmpty()
    @IsString()
    exam: string;

    @IsNotEmpty()
    @IsObject()
    schedule: Record<string, { subject: string; startTime: string; endTime: string }>;
}
