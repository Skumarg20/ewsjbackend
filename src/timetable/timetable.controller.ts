import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Request, Patch } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { CreateTimeTableDto, UpdateSessionDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { GenerateTimetableDto } from './dto/generate-timetable.dto';
import {RateLimitGuard} from '../rate-limit/rate-limit.guard';
import { RateLimited } from '../rate-limit/rate-limit.decorator';

@Controller('timetables')
@UseGuards(JwtAuthGuard,RateLimitGuard) 
export class TimetableController {
    constructor(private readonly timetableService: TimetableService,
    ) {}

    
    @Post()
    create(@Request() req, @Body() createTimetableDto: CreateTimeTableDto) {
       
        const userId=req.user.userId;
        return this.timetableService.create(userId,createTimetableDto);
    }


    @Get()
    findAll(@Request() req) {
        const userId=req.user.userId;
        return this.timetableService.findAll(userId);
    }
    @Post('generatetimetable')
    @RateLimited('generateTimetable')
    generateTimeTable(@Body() generateTimetableDto:GenerateTimetableDto){
    // const userId=req.user.userId;
    return this.timetableService.generateTimeTable(generateTimetableDto);
    }
   @Get('currenttimetable')
   findCurrentTime(@Request() req){
    const userId=req.user.userId;
    return this.timetableService.findCurrent(userId);
   }
   @Get('sessions')
   getSessions(@Request() req){
       const userId=req.user.userId;
       return this.timetableService.getSessions(userId);
   }
    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        const userId=req.user.userId;
        return this.timetableService.findOne(id);
    }

   
    @Get('session/:id')
    getSession(@Param('id') sessionId:string,@Request() req){
        const userId=req.user.userId;
        return this.timetableService.getSession(sessionId,userId);
    }
    @Patch('session/:id')
     updateSession(
    @Param('id') sessionId: string,
    @Request() req,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    
    const userId=req.user.userId;
    return this.timetableService.updateSession(sessionId,userId, updateSessionDto);
  }
    // @Put(':id')
    // update(@Param('id') id: string, @Request() req, @Body() updateTimetableDto: UpdateTimetableDto) {
    //     const userId=req.user.userId;
    //     console.log(userId);
    //     return this.timetableService.update(id, userId, updateTimetableDto);
    // }

 
    // @Delete(':id')
    // remove(@Param('id') id: string, @Request() req) {
    //     return this.timetableService.remove(id, req.user.userId);
    // }
}
