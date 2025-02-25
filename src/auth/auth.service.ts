import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';
import { User } from '../../entities/user.entity';
import { SignUpDto } from './dto/signup.dto';


@Injectable()
export class AuthService {
  
  constructor(
   private readonly userService:UserService,
    private readonly jwtService: JwtService,
     
  ) {}


  async signUp(signUpDto: SignUpDto): Promise<{ access_token: string }> {
    const { username, email, fullname, phonenumber, password, studentclass, exam, address } = signUpDto;

    // Validate required fields
    if (!password) {
      throw new BadRequestException('Password is required');
    }
    if (!username) {
      throw new BadRequestException('Username is required');
    }
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    if (!phonenumber) {
      throw new BadRequestException('Phone number is required');
    }
    if (!studentclass) {
      throw new BadRequestException('Class is required');
    }
    if (!exam) {
      throw new BadRequestException('Exam is required');
    }
    if (!address) {
      throw new BadRequestException('Address is required');
    }
    if (!fullname) {
      throw new BadRequestException('Full name is required');
    }

    // Check for existing user
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email or username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with all fields
    const user = await this.userService.createUser({
      username,
      email,
      fullname,
      phonenumber, // Ensure this is passed
      password: hashedPassword,
      studentclass, // Ensure this is passed
      exam,
      address, // Ensure this is passed
    });

    if (!user) {
      throw new BadRequestException('User creation failed');
    }


    const payload = { sub: user.id, username: user.username, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

 
async validateUser(email: string, password: string): Promise<User | null> {
  const user = await this.userService.findOneByEmail(email);
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }
  return null;
}

  async signIn(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}