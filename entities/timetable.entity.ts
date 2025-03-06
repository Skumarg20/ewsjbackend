import { 
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, 
  CreateDateColumn, UpdateDateColumn, 
  OneToMany
} from 'typeorm';
import { User } from './user.entity';
import { StudySession } from './StudySession';
@Entity()
export class TimeTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date',nullable: true })
  date: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  study_hours: number;

  @OneToMany(() => StudySession, (session) => session.timeTable, { cascade: true })
  schedule: StudySession[];

  @Column({ type: 'text', nullable: true })
  quote: string;


  @ManyToOne(() => User, (user) => user.timetables, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
  

  
}
