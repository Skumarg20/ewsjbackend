import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateNoteDto {
    @IsOptional()
    @IsString()
    subject?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsObject()
    content?: any; 
}
