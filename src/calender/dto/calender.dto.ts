// calendar/dto/create-event.dto.ts
export class CreateEventDto {
    readonly title: string;
    readonly description: string;
    readonly start: Date;
    readonly end: Date;
    readonly allDay: boolean;
    readonly recurrenceRule?: string;
  }
  
  


