import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Group } from './group.entity';

@Entity()
export class GroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Group, (group) => group.members, { onDelete: 'CASCADE' })
  group: Group;
}

