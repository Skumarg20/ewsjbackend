import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne
  } from 'typeorm';
import { Notes } from './notes.entity';
import { User } from './user.entity';
  
  @Entity()
  export class Folder {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column()
    color: string;

    @Column()
    description?:string
  
    @OneToMany(() => Notes, (note)=> note.folder,{ onDelete: 'CASCADE' })
    notes: Notes[];

    @ManyToOne(() => User, user => user.folders, { onDelete: 'CASCADE' })
    user: User;
    @Column({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      name: 'created_at'
    })
    createdAt: Date;
  
    @Column({
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP',
      name: 'updated_at'
    })
    updatedAt: Date;
  
    @Column({
      type: 'timestamp',
      nullable: true,
      name: 'deleted_at'
    })
    deletedAt: Date;
  }