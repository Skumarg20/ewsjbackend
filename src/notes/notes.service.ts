import { Injectable, NotFoundException } from '@nestjs/common';
import { NotesRepository } from './notes.repo';
import { Notes } from '../../entities/notes.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
    constructor(private readonly notesRepository: NotesRepository) {}

    async createNote(createNoteDto: CreateNoteDto,userId:'uuid'): Promise<Notes> {

        return await this.notesRepository.createNote(createNoteDto,userId);
    }

    async getAllNotes(userId:'uuid'): Promise<Notes[]> {
        return await this.notesRepository.getAllNotesByUser(userId);
    }


    async getNoteById(id: string,userId:'uuid'): Promise<Notes> {
        const note = await this.notesRepository.getNoteById(id,userId);
        if (!note) throw new NotFoundException('Note not found');
        return note;
    }
    async createFolderSpecificNotes(userId:'uuid',folderId:'uuid',createNoteDto:CreateNoteDto):Promise<Notes>{
        return await this.notesRepository.createNotesForSpecificFolder(createNoteDto,folderId,userId)
    }
   async getAllNotesFolderSpecific(userId:string,folderId:string):Promise<Notes[]>{
    return await this.notesRepository.getAllNotesOfSpecificFolder(folderId,userId);
   }
    async updateNote(id: string, updateNoteDto: UpdateNoteDto,userId:'uuid'): Promise<Notes> {
        const note = await this.notesRepository.updateNote(id,userId, updateNoteDto);
        if (!note) throw new NotFoundException('Note not found');
        return note;
    }

    async deleteNote(id: string,userId:'uuid'): Promise<boolean> {
        return await this.notesRepository.deleteNote(id,userId);
    }
}
