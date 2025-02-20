import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateNoteDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsObject()
    content: any;  
}
