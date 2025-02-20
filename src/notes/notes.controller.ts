import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards,Request, Req, HttpStatus, Patch } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Notes } from '../../entities/notes.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from 'src/auth/jwt.strategy';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    @Post()
    
    async createNote(@Body() createNoteDto: CreateNoteDto,@Request() req): Promise<Notes> {
        const userId=req.user.userId;
        return await this.notesService.createNote(createNoteDto,userId);
    }

    @Get()
    async getAllNotes(@Request() req): Promise<Notes[]> {
        const userId=req.user.userId;
        return await this.notesService.getAllNotes(userId);
    }

    @Get(':id')
    async getNoteById(@Param('id') id: string,@Request() req): Promise<Notes> {
        const userId=req.user.userId;
        return await this.notesService.getNoteById(id,userId);
    }
   
    @Post(':folderId/note')
    async createFolderSpecificNote(@Param('folderId') folderId:string,@Request() req,createNoteDto:CreateNoteDto):Promise<Notes>{
        const userId=req.user.userId;
        return await this.notesService.createFolderSpecificNotes(folderId,userId,createNoteDto);
    }
    @Get(':folderId/notes')
    async getAllNotesFolderSpecific(@Param('folderId') folderId:string,@Request() req):Promise<Notes[]>{
        const userId=req.user.userId;
        return await this.notesService.getAllNotesFolderSpecific(folderId,userId);

    }
    @Patch(':id')
    async updateNote(
        @Param('id') id: string,
        @Body() updateNoteDto: UpdateNoteDto,
        @Request() req
    ): Promise<Notes> {
        const userId=req.user.userId;
        return await this.notesService.updateNote(id,updateNoteDto,userId);
    }

    @Delete(':id')
    async deleteNote(@Param('id') id: string,@Request() req): Promise<boolean> {
        const userId=req.user.userId;
        return await this.notesService.deleteNote(id,userId);
    }
}
