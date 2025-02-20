import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notes } from '../../entities/notes.entity';
import { NotesRepository } from './notes.repo';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Folder } from 'entities/notesFolder';

@Module({
    imports: [TypeOrmModule.forFeature([Notes,Folder])],
    controllers: [NotesController],
    providers: [NotesService, NotesRepository],
    exports: [NotesService]
})
export class NotesModule {}
