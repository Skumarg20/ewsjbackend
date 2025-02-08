import { Module } from '@nestjs/common';
import { LearningpathController } from './learningpath.controller';
import { LearningpathService } from './learningpath.service';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Import ConfigModule here to provide ConfigService
  controllers: [LearningpathController],
  providers: [LearningpathService], // Make sure OpenAIService is added as a provider
})
export class LearningpathModule {}
