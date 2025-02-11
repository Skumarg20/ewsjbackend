import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Notes {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    subject: string; 

    @Column()
    title: string;

    @Column('text')
    content: string | any;

    @ManyToOne(() => User, (user) => user.notes, { onDelete: 'CASCADE' })
    user: User;
}
