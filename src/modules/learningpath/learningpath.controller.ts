import { Body, Controller, Get, Post } from '@nestjs/common';
import { LearningpathService } from './learningpath.service';

@Controller('learningpath')
export class LearningpathController {
  constructor(private readonly learningpathService: LearningpathService) {}

  @Get()
  async gethello() {
    return "Hello World";
  }

  @Post()
  async generateLearningPath(@Body() body: any) {
    return this.learningpathService.generateLearningPath(body.query, body.time, body.subject, body.chapter);
  }
}
