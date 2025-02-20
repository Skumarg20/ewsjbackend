import { Controller, Post, Body, Get, BadRequestException } from '@nestjs/common';
import { StudyPlanService } from './studyPlan.ai.service';
import { StudyPlanInputDto } from './dto/studyplanner.dto';

@Controller('study-plan')
export class StudyPlanController {
  constructor(private readonly studyPlanService: StudyPlanService) {}

  @Get()
  async gethello(){
    return "hello world";
  }

  @Post('generate')
  async generateStudyPlan(@Body() input: StudyPlanInputDto) {
    return this.studyPlanService.generatePlan(input);
  }
 
  @Post('doubt')
  async askDoubt(@Body('doubt') message: string) {
  if (!message || typeof message !== 'string') {
    throw new BadRequestException('Invalid input: doubt must be a non-empty string.');
  }

  return this.studyPlanService.askDoubt(message);
}



}
