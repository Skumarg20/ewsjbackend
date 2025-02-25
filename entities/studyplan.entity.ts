import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, Index, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export enum PlanType {
  WEEKLY = 'weekly',
  TARGET = 'target',
  CUSTOM = 'custom'
}

export enum PlanStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  INPROGRESS = 'in-progress'
}

@Entity()
@Index(['planType'])
export class StudyPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PlanType,
    default: PlanType.WEEKLY
  })
  planType: PlanType;

  @Column({
    type: 'enum',
    enum: PlanStatus,
    default: PlanStatus.ACTIVE
  })
  status: PlanStatus;

  @Column({ type: 'json', nullable: true })
  weeklyData: object | null;

  @Column({ type: 'json', nullable: true })
  targetData: object | null;

  @Column({ type: 'json', nullable: true })
  customData: object | null;

  @Column({ type: 'json', nullable: true })
  progress: {
    completedItems: string[];
    hoursSpent: number;
    lastUpdated: Date;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.studyPlan, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'json', nullable: true })
  metrics: {
    totalHours: number;
    efficiencyScore: number;
    dailyAverage: number;
    completionPercentage: number;
  };
}
