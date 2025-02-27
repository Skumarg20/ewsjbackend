import {
  IsString,
  IsUUID,
  IsEmail,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  orderId: string;

  @IsNumber()
  amount: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsDateString()
  date: string;

  @IsString()
  exam: string;

  @IsString()
  @IsOptional()
  message: string;
}
