import { Check, Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user.entity';
import { Group } from './group.entity';

@Entity()
@Check(`("receiverId" IS NOT NULL OR "groupId" IS NOT NULL)`) // Ensures at least one is present
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' }) 
  content: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  sender: User;

  @ManyToOne(() => Group, (group) => group.messages, { nullable: true })
  @JoinColumn({ name: 'groupId' }) // Ensure correct column name
  group?: Group;

  @ManyToOne(() => User, (user) => user.receivedMessages, { nullable: true })
  @JoinColumn({ name: 'receiverId' }) 
  receiver?: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
