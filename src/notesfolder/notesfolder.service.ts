import { Folder } from 'entities/notesFolder';
import { Repository } from 'typeorm';
import { CreateFolderDto } from './dto/createfolder.dto';
import { InjectRepository } from '@nestjs/typeorm';

export class NotesFolderService {

  constructor(
     @InjectRepository(Folder)
    private readonly notesFolderRepository: Repository<Folder>) {}

  async createNotesFolder(
    userId: string,
    createFolderDto: CreateFolderDto,
  ): Promise<Folder> {
    const folder = await this.notesFolderRepository.create({
      ...createFolderDto,
      user: { id: userId },
    });
    return await this.notesFolderRepository.save(folder);
  }
  async findoneFolder(userId: string, folderId: string): Promise<Folder> {
    const folder = await this.notesFolderRepository
      .createQueryBuilder('folder')
      .where('folder.userId = :userId', { userId })
      .andWhere('folder.id = :folderId', { folderId })
      .getOne();
    if (!folder) {
      throw Error('folder is not found');
    }
    return folder;
  }
  async getAllFolder(userId: string): Promise<Folder[]> {
    const folders = await this.notesFolderRepository
      .createQueryBuilder('folders')
      .leftJoinAndSelect('folders.notes', 'notes')
      .andWhere('folders.userId = :userId', { userId })
      
      .getMany();
    if (!folders) {
      throw Error('folders are not found');
    }
    return folders;
  }

  async deleteFolder(userId: 'uuid', folderId: 'uuid'): Promise<boolean> {
    console.log(folderId, userId, 'this is deleting details');
    const folder = await this.notesFolderRepository
      .createQueryBuilder('folder')
      .where('folder.userId = :userId', { userId })
      .andWhere('folder.id = :folderId', { folderId })
      .getOne();

    if (!folder) {
      return false;
    }

    await this.notesFolderRepository.delete(folderId);

    const checkFolder = await this.notesFolderRepository
      .createQueryBuilder('folder')
      .andWhere('folder.id = :folderId', { folderId })
      .getOne();

    return checkFolder === null;
  }
}
