import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GroupMember } from './group-member.entity';
import { Message } from './message.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true }) // Changed to support longer descriptions
  description: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => GroupMember, (member) => member.group)
  members: GroupMember[];

  @OneToMany(() => Message, (message) => message.group)
  messages: Message[];
}
