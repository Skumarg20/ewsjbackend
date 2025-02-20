import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TimeTable } from "./timetable.entity";

@Entity()
export class StudySession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  time: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ nullable: true })
  topic: string;

  @Column()
  activity: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: false })
  completed: boolean;  

  @ManyToOne(() => TimeTable, (timeTable) => timeTable.schedule, { onDelete: 'CASCADE' })
  timeTable: TimeTable;
}
