import { IsNotEmpty, IsOptional } from "class-validator";


export class CreateFolderDto{
    @IsNotEmpty()
    name:string;

    @IsNotEmpty()
    @IsOptional()
    color:string;

    @IsOptional()
    description?:string
}