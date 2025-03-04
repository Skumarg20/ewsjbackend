import { PlanType } from 'enum/plan.enum';
import { dateInTimeZone } from 'rrule/dist/esm/dateutil';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column({ nullable: true })
  paymentId: string;

  @Column({ nullable: true })
  signature: string;

  @Column()
  amount: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'timestamp' })
  date: Date;
 
  @Column({ type: "enum", enum: PlanType })
  plan: PlanType;

  @ManyToOne(() => User, (user) => user.payments) // Many payments belong to one user
  user: User;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;
}
