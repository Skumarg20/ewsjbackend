import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notes } from '../../entities/notes.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { throws } from 'assert';
import { Folder } from 'entities/notesFolder';
import { NotesFolderService } from 'src/notesfolder/notesfolder.service';

@Injectable()
export class NotesRepository {
    NotesFolderService: any;
    constructor(
       
        @InjectRepository(Notes)
        private readonly notesRepo: Repository<Notes>,
        @InjectRepository(Folder)
        private readonly notesFolderRepository: Repository<Folder>,
    
    ) {}

    /** 🔹 Create Note for a Specific User */
    async createNote(createNoteDto: CreateNoteDto, userId: string): Promise<Notes> {
        console.log(createNoteDto,"this is dto i am sending to save");
        const note = this.notesRepo.create({
            ...createNoteDto,
            content: createNoteDto.content,
            user: { id: userId }, 
        });
     console.log(note,"this is not after saving");
        return await this.notesRepo.save(note);
    }
 /** create notes for a specific folder */
 async createNotesForSpecificFolder(createNoteDto:CreateNoteDto,folderId:'uuid',userId:'uuid'):Promise<Notes>{
    console.log(createNoteDto,"this is dto in service");
    console.log(folderId,userId,"this is folderId and userId");
    const folder = await this.notesFolderRepository
    .createQueryBuilder('folder')
    .where('folder.userId = :userId', { userId })
    .andWhere('folder.id = :folderId', { folderId })
    .getOne();
  console.log(folder,"this is folder");
    if (!folder) {
        throw Error('folder is not found');
    }
    const note = this.notesRepo.create({
        ...createNoteDto, 
        content: JSON.stringify(createNoteDto.content), 
        folder, 
        user: { id: userId },   
      });
    console.log(note,"this is notes after saving");
    return await this.notesRepo.save(note);
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
