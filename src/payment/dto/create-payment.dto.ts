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

export class HindiMediumCourseDto{
  @IsUUID()
  orderId:string;

  @IsNumber()
  amount:number;

  @IsEmail()
  email:string;
  
}

export class VerfiyCoursePaymentDto{
  @IsString()
  @IsNotEmpty()
  razorpay_payment_id: string;

  @IsString()
  @IsNotEmpty()
  razorpay_order_id: string;

  @IsString()
  @IsNotEmpty()
  razorpay_signature: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  exam:string;
  
  @IsString()
  message:string;

  @IsString()
  @IsNotEmpty()
  phoneNumber:string;

}

