import { Repository } from 'typeorm';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
        
        const note = this.notesRepo.create({
            ...createNoteDto,
            content: createNoteDto.content,
            user: { id: userId }, 
        });
     

        return await this.notesRepo.save(note);
    }
 /** create notes for a specific folder */
 async createNotesForSpecificFolder(createNoteDto:CreateNoteDto,folderId:'uuid',userId:'uuid'):Promise<Notes>{
   
    const folder = await this.notesFolderRepository
    .createQueryBuilder('folder')
    .where('folder.userId = :userId', { userId })
    .andWhere('folder.id = :folderId', { folderId })
    .getOne();

    if (!folder) {
        throw Error('folder is not found');
    }
    const note = this.notesRepo.create({
        ...createNoteDto, 
        content: JSON.stringify(createNoteDto.content), 
        folder, 
        user: { id: userId },   
      });
   
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

    async updateNote(userId: string, noteId: string, updateNoteDto: UpdateNoteDto): Promise<Notes> {
        // Input validation
        if (!userId || !noteId) {
            throw new BadRequestException('User ID and Note ID are required');
        }
    
        try {
            
            const note = await this.notesRepo.createQueryBuilder('notes')
                .where('notes.id = :noteId', { noteId })
                .andWhere('notes.userId = :userId', { userId })
                .getOne(); 
    
          
            if (!note) {
                throw new NotFoundException('Note not found for this user');
            }
    
           
            Object.assign(note, updateNoteDto);
           
    
            return await this.notesRepo.save(note);
        } catch (error) {
            console.error('Error in updateNote:', error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to update note: ' + error.message);
        }
    }
   
    async deleteNote(userId: string, noteId: string): Promise<boolean> {
        const note = await this.getNoteById(userId, noteId);
        if (!note) throw new NotFoundException('Note not found for this user');

        const result = await this.notesRepo.delete(noteId);
        return (result.affected ?? 0) > 0;
    }
}
