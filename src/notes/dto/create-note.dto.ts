import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class CreateNoteDto {
    @IsNotEmpty()
    @IsString()
    subject: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsObject()
    content: any;  // Can be rich text (JSON format)
}
