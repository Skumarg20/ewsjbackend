// src/todo/todo.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../../entities/todo.entity';
import { CreateTodoDto, updateTodo } from './dto/createtodo.dto';
@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(todo: CreateTodoDto,userId:string): Promise<Todo|null> {
    const newTodo = this.todoRepository.create(
     { ...todo,
      user: { id: userId }}
    );

    return await this.todoRepository.save(newTodo);
  }

  async findAll(userId: string, page: number = 1, limit: number = 1): Promise<{ todos: Todo[], total: number }> {
    const queryBuilder = this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.userId = :userId', { userId });
  
 
    const skip = (page - 1) * limit; 
    queryBuilder.skip(skip).take(limit);
  
    const [todos, total] = await queryBuilder.getManyAndCount();
  
    return {
      todos, 
      total, 
    };
  }

  async findOne(id: string): Promise<Todo|null> {
    return await this.todoRepository.findOne({ where: { id } });
  }

  async update(id: string, todo: updateTodo): Promise<Todo|null> {
    await this.todoRepository.update(id, todo);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
}