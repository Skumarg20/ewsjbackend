import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from '../../entities/chatentities/message.entity';
import { Group } from '../../entities/chatentities/group.entity';
import { UserModule } from 'src/users/users.module';
import { GroupMember } from 'entities/chatentities/group-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Group,GroupMember]),UserModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
