import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
@Entity()
export class TimeTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  day: string;

  @Column()
  exam: string;

  @Column({ type: 'simple-json' })
  schedule: any;

  @ManyToOne(() => User, (user) => user.timetables, { onDelete: 'CASCADE' })
  user: User;
}
