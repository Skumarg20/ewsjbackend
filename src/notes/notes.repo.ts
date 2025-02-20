import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notes } from '../../entities/notes.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { throws } from 'assert';

@Injectable()
export class NotesRepository {
    constructor(
        @InjectRepository(Notes)
        private readonly notesRepo: Repository<Notes>
    ) {}

    /** 🔹 Create Note for a Specific User */
    async createNote(createNoteDto: CreateNoteDto, userId: string): Promise<Notes> {
        const note = this.notesRepo.create({
            ...createNoteDto,
            content: JSON.stringify(createNoteDto.content),
            user: { id: userId }, 
        });

        return await this.notesRepo.save(note);
    }
 /** create notes for a specific folder */
 async createNotesForSpecificFolder(createNote:CreateNoteDto,folderId:string,userId:string):Promise<Notes>{
    const notes=this.notesRepo.create({
        ...createNote,
        content:JSON.stringify(createNote.content),
        user:{id:userId},
        folder:{id:folderId},
    });
    return await this.notesRepo.save(notes);
 }
 /**Get all notes of specific folder */
async getAllNotesOfSpecificFolder(folderId:string,userId:string):Promise<Notes[]>{
    const notes=await this.notesRepo.createQueryBuilder('notes')
                          .andWhere('notes.folder_id =:folderId',{folderId})
                          .andWhere('notes.user_id =:userId',{userId})
                          .getMany();
  if(!notes){
    throw new NotFoundException(' Notes are not found for this folder')
  }
    return notes;
}

 /** 🔹 Get All Notes for a Specific User */
    async getAllNotesByUser(userId: string): Promise<Notes[]> {
        return await this.notesRepo.find({ where: { user: { id: userId } } });
    }


    async getNoteById(userId: string, noteId: string): Promise<Notes | null> {
        return await this.notesRepo.findOne({ where: { id: noteId, user: { id: userId } } });
    }

  
    async updateNote(userId: string, noteId: string, updateNoteDto: UpdateNoteDto): Promise<Notes | null> {
        const note = await this.getNoteById(userId, noteId);
        if (!note) throw new NotFoundException('Note not found for this user');

        Object.assign(note, updateNoteDto);
        return await this.notesRepo.save(note);
    }

   
    async deleteNote(userId: string, noteId: string): Promise<boolean> {
        const note = await this.getNoteById(userId, noteId);
        if (!note) throw new NotFoundException('Note not found for this user');

        const result = await this.notesRepo.delete(noteId);
        return (result.affected ?? 0) > 0;
    }
}
