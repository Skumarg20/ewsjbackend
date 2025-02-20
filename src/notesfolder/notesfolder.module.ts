import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from 'entities/notesFolder';
import { NotesFolderService } from './notesfolder.service';
import { NotesFolderController } from './notesfolder.controller';


@Module({
    imports:[TypeOrmModule.forFeature([Folder])],
    providers:[NotesFolderService,TypeOrmModule],
    controllers:[NotesFolderController],
    exports:[]
})

export class NotesFolderModule{

}