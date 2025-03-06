import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

// export class AddressDto {
//   @IsString()
//   @IsNotEmpty()
//   street: string;

//   @IsString()
//   @IsNotEmpty()
//   city: string;

//   @IsString()
//   @IsNotEmpty()
//   state: string;

//   @IsString()
//   @IsNotEmpty()
//   postalCode: string;

//   @IsString()
//   @IsOptional()
//   country?: string;
// }

export class SignUpDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullname: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phonenumber: string;

  @IsString()
  @IsNotEmpty({ message: 'Student class is required' })
  studentclass: string;

  @IsString()
  @IsNotEmpty({ message: 'Exam is required' })
  exam: string;

  
}