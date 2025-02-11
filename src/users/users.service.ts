import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { SignUpDto } from 'src/auth/dto/signup.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User|any> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(signUpDto:SignUpDto): Promise<User> {
    const {username,password,fullname,exam,email,studentclass}=signUpDto
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    return this.userRepository.save({ username,password,fullname,exam,email,class:studentclass });
  }

  async findUsersByIds(userIds: string[]): Promise<User[]> {
    return this.userRepository.find({
      where: { id: In(userIds) },
    });
  }
}