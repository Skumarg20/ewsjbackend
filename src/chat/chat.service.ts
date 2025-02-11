import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from '../../entities/chatentities/message.entity';
import { Group } from '../../entities/chatentities/group.entity';
import { UserService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    private readonly userService:UserService

  ) {}

  async saveMessage(senderId: string, content: string, groupId?: string) {
    const message = this.messageRepository.create({ 
        sender: { id: senderId }, 
        content, 
        group: groupId ? { id: groupId } : undefined
    });

    return await this.messageRepository.save(message);
}



async sendMessage(senderId: string, receiverId: string, content: string) {
    const message = this.messageRepository.create({
        sender: { id: senderId },
        receiver: { id: receiverId }, 
        content,
    });

    return await this.messageRepository.save(message); 
}

  async createGroup(name: string, userIds: string[]) {
    const users = await this.userService.findUsersByIds(userIds);
    if (users.length === 0) throw new Error('No users found');

    const group = this.groupRepository.create({ name, members: users });
    return await this.groupRepository.save(group);
  }
}
