// src/todo/todo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { TodoStatus,TodoPriority } from 'src/todo/dto/createtodo.dto';
@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: TodoStatus,
    default: TodoStatus.PENDING,
  })
  status: TodoStatus;

  @Column({
    type: 'enum',
    enum: TodoPriority,
    default: TodoPriority.MEDIUM,
  })
  priority: TodoPriority;

  @Column()
  subject: string;

  @Column()
  due_date: string;

    @ManyToOne(() => User, (user) => user.todos, { onDelete: 'CASCADE' })
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