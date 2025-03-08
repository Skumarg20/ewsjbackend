import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { PlanType } from 'enum/plan.enum';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
  async findOneById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id:userId } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    if (!userData.email) {
      throw new BadRequestException('Email is required'); 
    }
    const existingUser = await this.findOneByEmail(userData.email); 
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findUsersByIds(userIds: string[]): Promise<User[]> {
    return this.userRepository.find({
      where: { id: In(userIds) },
    });
  }
  async updateUserPlan(userId: string, newPlan: PlanType, durationDays: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const now = new Date();
    const subscriptionEnd = new Date(now);
    subscriptionEnd.setDate(now.getDate() + durationDays);

    user.plan = newPlan;
    user.subscriptionStart = now;
    user.subscriptionDuration = durationDays;
    user.subscriptionEnd = subscriptionEnd;

    return this.userRepository.save(user);
  }
  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found');

    user.password = newPassword; // Update the password
    await this.userRepository.save(user); // Save updated user
  }
}