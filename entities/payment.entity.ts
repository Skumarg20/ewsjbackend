import { dateInTimeZone } from 'rrule/dist/esm/dateutil';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  exam: string;

  @Column({ type: 'timestamp' })
  date: Date;
  @Column()
  message: string;
  @Column()
  phoneNumber: string;

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
