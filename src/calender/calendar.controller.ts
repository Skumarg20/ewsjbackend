// calendar/calendar.controller.ts
import { Controller, Post, Get, Body, UseGuards,Request } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { CreateEventDto } from './dto/calender.dto';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('events')
  async createEvent(@Body() createEventDto: CreateEventDto,@Request() req) {
     const userId=req.user.userId;
    return this.calendarService.createEvent(userId,createEventDto);
  }

  @Get('events')
  async getEvents(@Request() req) {
    const userId=req.user.id;

    return this.calendarService.getEvents(userId);
  }
}