import { StudySession } from "entities/StudySession";

export interface TimeTableResponse {
    id: string;
    date: string | null;
    title: string;
    description: string;
    study_hours: number;
    schedule: StudySession[];
    quote: string | null;
    createdAt: Date;
    updatedAt: Date;
    total_time_spent: number; // Dynamically calculated
    completion_rate: number; // Dynamically calculated
  }