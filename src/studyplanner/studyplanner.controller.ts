import { Controller, Post, Body, Get, BadRequestException,Request, UseGuards } from '@nestjs/common';
import { StudyPlanService } from './studyplan.service';
import { StudyPlanInputDto } from './dto/studyplanner.dto';
import { CustomStudyPlanDto, TargetPlanDataDto, WeeklyPlanDataDto } from './dto/create-study-plan.dto';
import { JwtAuthGuard } from 'src/auth/jwt.strategy';
import { RateLimitGuard } from 'src/rate-limit/rate-limit.guard';
import { RateLimited } from 'src/rate-limit/rate-limit.decorator';
@Controller('study-plan')
@UseGuards(JwtAuthGuard,RateLimitGuard)
export class StudyPlanController {
  constructor(private readonly studyPlanService: StudyPlanService) {}

  @Get()
  async gethello(){
    return "hello world";
  }
  @Get('weekly-plan')
  async getWeeklyStudyPlan(@Request() req){
    return this.studyPlanService.getWeeklyStudyPlan(req.user.userId);
  }
  @Post('weekly-plan')
  async saveWeeklyStudyPlan(@Body() createWeeklyPlanDto:WeeklyPlanDataDto,@Request() req){
    const userId=req.user.userId;
   console.log(createWeeklyPlanDto,userId,"this is dto i am reciving to submit");
    return  this.studyPlanService.saveWeeklyStudyPlan(userId,createWeeklyPlanDto);
  }

  @Get('target-plan')
  async getTargetStudyPlan(@Request() req){
    return this.studyPlanService.getTargetedStudyPlan(req.user.userId);
  }
  @Post('target-plan')
  async saveTargetStudyPlan(@Body() createTargetPlanDto:TargetPlanDataDto,@Request() req){
    const userId=req.user.userId;
   console.log(createTargetPlanDto,userId,"this is dto i am reciving to submit");
    return  this.studyPlanService.saveTargetedStudyPlan(userId,createTargetPlanDto);
  }
  @Get('custom-plan')
  async getCustomStudyPlan(@Request() req){
    const userId=req.user.userId;
    return this.studyPlanService.getcustomStudyPlan(userId);
  }
  @Post('custom-plan')
  async saveCustomStudyPlan(@Body() customStudyPlanDto:CustomStudyPlanDto,@Request() req){
    const userId=req.user.userId;
    return this.studyPlanService.saveCustomStudyPlan(userId,customStudyPlanDto);
  }
  @Post('generate')
  @RateLimited('generateStudyPlan')
  async generateStudyPlan(@Body() input: StudyPlanInputDto) {
    return this.studyPlanService.generatePlan(input);
  }

  @Post('generate-targetplan')
  @RateLimited('generateTargetStudyPlan')
  async generateTargetStudyPlan(@Body() input: TargetPlanDataDto) { 
    return this.studyPlanService.generateTargetStudyPlan(input);
  }

 
  @Post('doubt')
  @RateLimited('askDoubt')
  async askDoubt(@Body('doubt') message: string) {
  if (!message || typeof message !== 'string') {
    throw new BadRequestException('Invalid input: doubt must be a non-empty string.');
  }

  return this.studyPlanService.askDoubt(message);
}



}
