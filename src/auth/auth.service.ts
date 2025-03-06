import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/users.service';
import { User } from '../../entities/user.entity';
import { SignUpDto } from './dto/signup.dto';
import { PlanType } from 'enum/plan.enum';


@Injectable()
export class AuthService {
  
  constructor(
   private readonly userService:UserService,
    private readonly jwtService: JwtService,
     
  ) {}


  async signUp(signUpDto: SignUpDto): Promise<{ access_token: string }> {
    const { username, email, fullname, phonenumber, password, studentclass, exam } = signUpDto;

   
    if (!password) throw new BadRequestException('Password is required');
    if (!username) throw new BadRequestException('Username is required');
    if (!email) throw new BadRequestException('Email is required');
    if (!phonenumber) throw new BadRequestException('Phone number is required');
    if (!studentclass) throw new BadRequestException('Class is required');
    if (!exam) throw new BadRequestException('Exam is required');
    if (!fullname) throw new BadRequestException('Full name is required');

    // Check for existing user
    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email or username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Assign FREE plan with 30-day subscription
    const now = new Date();
    const subscriptionDuration = 30; // 30 days for FREE plan
    const subscriptionEnd = new Date(now);
    subscriptionEnd.setDate(now.getDate() + subscriptionDuration);

    // Create the user with FREE plan
    const user = await this.userService.createUser({
      username,
      email,
      fullname,
      phonenumber,
      password: hashedPassword,
      class: studentclass,
      exam,
      plan: PlanType.FREE, 
      subscriptionStart: now,
      subscriptionDuration,
      subscriptionEnd,
    });

    if (!user) {
      throw new BadRequestException('User creation failed');
    }

    // JWT payload
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      phonenumber: user.phonenumber,
      studentclass: user.class,
      exam: user.exam,
      plan: user.plan,
      subscriptionStart: user.subscriptionStart,
      subscriptionDuration: user.subscriptionDuration,
      subscriptionEnd: user.subscriptionEnd,
    };

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
    const payload = { sub: user.id, username: user.username,fullname: user.fullname, email: user.email, phonenumber: user.phonenumber, studentclass: user.class, exam: user.exam, plan: user.plan, subscriptionStart: user.subscriptionStart, subscriptionDuration: user.subscriptionDuration, subscriptionEnd: user.subscriptionEnd };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}