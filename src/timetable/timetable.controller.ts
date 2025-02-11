import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Request } from '@nestjs/common';
import { TimetableService } from './timetable.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';
import { JwtAuthGuard } from '../auth/jwt.strategy';


@Controller('timetables')
@UseGuards(JwtAuthGuard) 
export class TimetableController {
    constructor(private readonly timetableService: TimetableService) {}

    
    @Post()
    create(@Request() req, @Body() createTimetableDto: CreateTimetableDto) {
        const userId=req.user.userId;
        return this.timetableService.create(userId,createTimetableDto);
    }


    @Get()
    findAll(@Request() req) {
        const userId=req.user.userId;
        return this.timetableService.findAll(userId);
    }

 
    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        const userId=req.user.userId;
        return this.timetableService.findOne(id, userId);
    }

  
    @Put(':id')
    update(@Param('id') id: string, @Request() req, @Body() updateTimetableDto: UpdateTimetableDto) {
        const userId=req.user.userId;
        return this.timetableService.update(id, userId, updateTimetableDto);
    }

  
    // @Delete(':id')
    // remove(@Param('id') id: string, @Request() req) {
    //     return this.timetableService.remove(id, req.user.userId);
    // }
}
