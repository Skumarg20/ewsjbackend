import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity'; // Correct import path
import { Optional } from '@nestjs/common';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid') // Fix: UUID should be stored as string
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  start: Date;

  @Column({ type: 'timestamp' })
  end: Date;

  @Column({ default: false })
  allDay: boolean;
  
  @Optional()
  @Column({ type: 'text', nullable: true })
  recurrenceRule?: string;

  @ManyToOne(() => User, user => user.events, { onDelete: 'CASCADE' }) 
  user: User;
}
