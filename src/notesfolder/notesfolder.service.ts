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

  async getAllFolder(userId: string): Promise<Folder[]> {
    const folders = await this.notesFolderRepository
      .createQueryBuilder('folders')
      .andWhere('folders.userId = :userId', { userId })
      .getMany();
    if (!folders) {
      throw Error('folders are not found');
    }
    return folders;
  }

  async deleteFolder(userId: string, folderId: string): Promise<boolean> {
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
