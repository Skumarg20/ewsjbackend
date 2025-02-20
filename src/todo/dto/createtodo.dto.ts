import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export enum TodoPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  }
export enum TodoStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  POSTPONED = "postponed",
  REJECTED = "rejected",
 }
    
export class CreateTodoDto {
    
      
        @IsString()
        @IsNotEmpty()
        title: string;
      
        @IsString()
        @IsNotEmpty()
        description: string;
      
        @IsEnum(TodoStatus)
        @IsNotEmpty()
        @IsOptional()
        status?: TodoStatus;
      
        @IsEnum(TodoPriority)
        @IsNotEmpty()
        priority: TodoPriority;
      
        @IsString()
        @IsNotEmpty()
        @IsOptional()
        subject?: string;
      
        @IsString()
        @IsNotEmpty()
        due_date?: string;
      }


  export class updateTodo{
    @IsEnum(TodoStatus)
    @IsNotEmpty()
    @IsOptional()
    status?: TodoStatus;

    @IsEnum(TodoPriority)
    @IsNotEmpty()
    @IsOptional()
    priority?: TodoPriority;
  }