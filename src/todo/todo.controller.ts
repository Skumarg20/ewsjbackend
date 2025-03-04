// src/todo/todo.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Param,
  Put,
  Delete,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from '../../entities/todo.entity';
import { CreateTodoDto, updateTodo } from './dto/createtodo.dto';
import { JwtAuthGuard } from 'src/auth/jwt.strategy';
import { User } from 'entities/user.entity';
import { todo } from 'node:test';
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(
    @Body() createtodo: CreateTodoDto,
    @Request() req,
  ): Promise<Todo | null> {
    const userId = req.user.userId;
    return this.todoService.create(createtodo, userId);
  }

  @Get()
  async getTodos(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Request() req,
  ) {
    const userId = req.user.userId;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    return this.todoService.findAll(userId, pageNum, limitNum);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Todo | null> {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatetodo: updateTodo,
  ): Promise<Todo | null> {
    return this.todoService.update(id, updatetodo);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.todoService.remove(id);
  }
}
