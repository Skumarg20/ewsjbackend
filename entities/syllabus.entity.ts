import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Syllabus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    subject: string;  

    @Column({ type: 'jsonb' })
    topics: Record<string, { completed: boolean }>; 
}
