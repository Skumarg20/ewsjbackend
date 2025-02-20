import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Event } from './event.entity';
import { Notes } from './notes.entity';
import { TimeTable } from './timetable.entity';
import { Message } from './chatentities/message.entity';
import { Group } from './chatentities/group.entity';
import { GroupMember } from './chatentities/group-member.entity';
import { Todo } from './todo.entity';
import { Folder } from './notesFolder';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  class: string; 

  @Column()
  exam: string; 

  @OneToMany(() => Event, (event) => event.user, { cascade: true }) 
  events: Event[];

  @OneToMany(() => Notes, (note) => note.user, { cascade: true })
  notes: Notes[];

  @OneToMany(() => TimeTable, (timetable) => timetable.user, { cascade: true })
  timetables: TimeTable[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[]; // Renamed for clarity

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];
  @OneToMany(() => Folder, folder => folder.user)
  folders: Folder[];
  @OneToMany(()=>Todo,(todo)=>todo.user,{cascade:true})
  todos:Todo[];

  @ManyToMany(() => Group, (group) => group.members)
  @JoinTable()
  groups: Group[];


}
