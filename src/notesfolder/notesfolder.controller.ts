import { Body, Controller,Delete,Get,Param,Post,Request, UseGuards } from "@nestjs/common";
import { NotesFolderService } from "./notesfolder.service";
import { Folder } from "entities/notesFolder";
import { CreateFolderDto } from "./dto/createfolder.dto";
import { JwtAuthGuard } from "src/auth/jwt.strategy";


@Controller('notesfolder')
@UseGuards(JwtAuthGuard)
export class NotesFolderController{
    constructor(
        private readonly notesFolderService:NotesFolderService
    ){}

    @Get()
    async getAllFolder(@Request() req):Promise<Folder[]>{
        const userId=req.user.userId;
      
        return await this.notesFolderService.getAllFolder(userId);
    }

    @Post()
    async createFolder(@Request() req,@Body() createFolderDto:CreateFolderDto):Promise<Folder>{
        const userId=req.user.userId;
       
        return this.notesFolderService.createNotesFolder(userId,createFolderDto);
    }

    @Delete(':id')
    async deleteFolder(@Request() req,@Param('id') id:'uuid'):Promise<Boolean>{
        const userId=req.user.userId;
       
        return this.notesFolderService.deleteFolder(userId,id);

    }
}