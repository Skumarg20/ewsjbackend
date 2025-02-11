import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user.entity';
import { Group } from './group.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' }) // Changed to support longer messages
  content: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  sender: User;

  @ManyToOne(() => Group, (group) => group.messages, { nullable: true }) // Made nullable for direct messages
  group?: Group;

  @ManyToOne(() => User, (user) => user.receivedMessages, { nullable: true }) 
  @JoinColumn({ name: 'receiverId' }) 
  receiver?: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
