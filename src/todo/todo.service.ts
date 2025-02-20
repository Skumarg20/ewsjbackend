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

  async findAll(userId:string): Promise<Todo[]> {
    return await this.todoRepository
    .createQueryBuilder('todo')
    .where('todo.userId = :userId', { userId })
    .getMany();
  

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