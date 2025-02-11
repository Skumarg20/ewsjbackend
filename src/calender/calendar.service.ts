// calendar/calendar.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../entities/event.entity';
import { CreateEventDto } from './dto/calender.dto';
import { RRule } from 'rrule';
import { UpdateEventDto } from './dto/update-event.dto';
@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async createEvent(userId: 'uuid', createEventDto: CreateEventDto): Promise<Event> {
    console.log(createEventDto,userId);
    const event = await this.eventRepository.create({
      ...createEventDto,
      user: { id: userId },
    });
    return this.eventRepository.save(event);
  }

  async getEvents(userId: 'uuid'): Promise<Event[]> {
    return this.eventRepository.find({
      where: { user: { id: userId } },
    });
  }
  async getRecurringEvents(userId: 'uuid'): Promise<Event[]> {
    const events = await this.getEvents(userId);
    return events.flatMap(event => {
      if (!event.recurrenceRule) return [event];
      
      const rule = RRule.fromString(event.recurrenceRule);
      return rule.all().map(date => ({
        ...event,
        start: date,
        end: new Date(date.getTime() + (event.end.getTime() - event.start.getTime()))
      }));
    });
  }

  async updateEvent(userId: 'uuid', eventId: 'uuid', updateData: UpdateEventDto) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId, user: { id: userId } },
    });
    
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    
    return this.eventRepository.update(eventId, updateData);
  }
}