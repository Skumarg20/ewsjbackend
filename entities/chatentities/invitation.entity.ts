// // src/chat/entities/invitation.entity.ts
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// import { User } from '../../enitites/user.entity';
// import { Group } from './group.entity';

// @Entity()
// export class Invitation {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => User, (user) => user.sentInvitations)
//   sender: User;

//   @ManyToOne(() => User, (user) => user.receivedInvitations)
//   receiver: User;

//   @ManyToOne(() => Group)
//   group: Group;

//   @Column({ default: 'pending' })
//   status: 'pending' | 'accepted' | 'rejected';
// }