import { Module } from "@nestjs/common/decorators";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Todo } from "entities/todo.entity";
import { TodoService } from "./todo.service";
import { TodoController } from "./todo.controller";


@Module({
imports:[TypeOrmModule.forFeature([Todo])],
providers:[TodoService],
controllers:[TodoController],
exports:[TodoService,TypeOrmModule]
})
export class todoModule{}