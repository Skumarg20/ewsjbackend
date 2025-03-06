import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Event } from './event.entity';
import { Notes } from './notes.entity';
import { TimeTable } from './timetable.entity';
import { Message } from './chatentities/message.entity';
import { Group } from './chatentities/group.entity';
import { GroupMember } from './chatentities/group-member.entity';
import { Todo } from './todo.entity';
import { Folder } from './notesFolder';
import { StudyPlan } from './studyplan.entity';
import { PlanType } from 'enum/plan.enum';
import { Payment } from './payment.entity';

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
  @Column({nullable:true})
  phonenumber:string;

  @Column({ unique: true })
  email: string;

  @Column()
  class: string; 

  @Column()
  exam: string; 
  
  @Column({
    type: 'enum',
    enum: PlanType,
    default: PlanType.FREE,
  })
  plan: PlanType;
  
  @Column({ nullable: true })
  subscriptionStart: Date;

  @Column({ nullable: true })
  subscriptionDuration: number;

  @Column({ nullable: true })
  subscriptionEnd: Date;

  @OneToMany(() => Event, (event) => event.user, { cascade: true }) 
  events: Event[];

  @OneToMany(() => Notes, (note) => note.user, { cascade: true })
  notes: Notes[];

  @OneToMany(() => TimeTable, (timetable) => timetable.user, { cascade: true })
  timetables: TimeTable[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[]; // Renamed for clarity
  @OneToMany(()=>StudyPlan,(studyPlan)=>studyPlan.user)
  studyPlan:StudyPlan[]
  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];
  @OneToMany(() => Folder, folder => folder.user)
  folders: Folder[];
  @OneToMany(()=>Todo,(todo)=>todo.user,{cascade:true})
  todos:Todo[];

  @ManyToMany(() => Group, (group) => group.members)
  @JoinTable()
  groups: Group[];
  @OneToMany(() => Payment, (payment) => payment.user) // One user has many payments
  payments: Payment[];


}
