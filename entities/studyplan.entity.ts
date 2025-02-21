// study-plan.entity.ts
import { CustomPlanData, TargetPlanData, WeeklyPlanData } from 'interface/study-plan.interface';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, Index } from 'typeorm';

export enum PlanType {
  WEEKLY = 'weekly',
  TARGET = 'target',
  CUSTOM = 'custom'
}

export enum PlanStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  INPROGRESS='in-progress'
}

@Entity()
@Index(['userId', 'planType'])
@Index(['startDate', 'endDate'])
export class StudyPlan  {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

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

   @Column({ 
        type: 'json',
        nullable: true,
        transformer: {
          to(value: WeeklyPlanData): string {
            return JSON.stringify(value);
          },
          from(value: string): WeeklyPlanData {
            return JSON.parse(value);
          }
        }
      })
      weeklyData: WeeklyPlanData | null;

  @Column({ 
       type: 'json',
       nullable: true,
       transformer: {
         to(value: TargetPlanData): string {
           return JSON.stringify(value);
         },
         from(value: string): TargetPlanData {
           return JSON.parse(value);
         }
       }
     })
     targetData: TargetPlanData | null;
   
     @Column({ 
       type: 'json',
       nullable: true,
       transformer: {
         to(value: CustomPlanData): string {
           return JSON.stringify(value);
         },
         from(value: string): CustomPlanData {
           return JSON.parse(value);
         }
       }
     })
     customData: CustomPlanData | null;
  // Progress tracking
  @Column({ type: 'json', default: {} })
  progress: {
    completedItems: string[];
    hoursSpent: number;
    lastUpdated: Date;
  };

  // Common dates
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // For weekly/target plans
  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  // Metrics and calculations
  @Column({ type: 'json', default: {} })
  metrics: {
    totalHours: number;
    efficiencyScore: number;
    dailyAverage: number;
    completionPercentage: number;
  };

  // Versioning for updates
  @Column({ default: 1 })
  version: number;
}