import { Injectable, UnauthorizedException } from '@nestjs/common';
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
    const { username, email, fullname, password, studentclass, exam, address } = signUpDto;

    if (!password) {
        throw new Error('Password is required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.createUser({
        username,
        email,
        fullname,
        password: hashedPassword,
       studentclass,
        exam,
        address
    });

    if (!user) {
        throw new Error('User creation failed');
    }

    const payload = { sub: user.id, username: user.username };

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