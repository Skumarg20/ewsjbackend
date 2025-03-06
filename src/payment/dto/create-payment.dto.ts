import {
  IsUUID,
  IsNumber,
  IsDateString,
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
  IsOptional, 
} from 'class-validator';
import { PlanType } from 'enum/plan.enum';

export class CreatePaymentDto {
  
  @IsUUID()
  orderId: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  plan: PlanType;
}


