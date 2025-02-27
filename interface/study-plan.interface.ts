// study-plan.interface.ts
export interface WeeklyPlanData {
    dailyPlan:string[];
    dailyHours: number;
    subjects: string[];
    chapters:string[];
    schoolSchedule?: string;  
  }
  
  export interface TargetPlanData {
    dailyPlan:string[];
    subjects: string[];
    dueDate: Date;
    chapters: string[];
    dailyHours: number;
    existingCommitments: boolean;
    milestones: string[];
  }
  
  export interface CustomPlanData {
    content: string;
  }
  