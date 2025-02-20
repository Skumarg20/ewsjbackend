export enum DurationUnit {
    Weeks = 'weeks',
    Months = 'months',
    Years = 'years'
  }
  
  export class StudyPlanInputDto {
    exam: string; 
    
    duration: number; 
    
    durationUnit: DurationUnit; 
    
    isBoardExam: boolean; 
    
    dailyStudyHours: number; 
    
    targetTopics?: string[]; 
    
  
    targetQuestionsPerSubject?: { 
      [subject: string]: number; 
    }; 
  }
  