import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateNoteDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsObject()
    content?: any; 
}
