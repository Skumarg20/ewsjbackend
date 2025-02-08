import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { VideosummerizeService } from './modules/videosummerize/videosummerize.service';
import { VideosummerizeController } from './modules/videosummerize/videosummerize.controller';
import { LearningpathModule } from './modules/learningpath/learningpath.module';
import { LearningpathController } from './modules/learningpath/learningpath.controller';
import { LearningpathService } from './modules/learningpath/learningpath.service';

@Module({
  imports: [ ConfigModule.forRoot(), LearningpathModule],
  controllers: [AppController,VideosummerizeController,LearningpathController],
  providers: [AppService,VideosummerizeService,LearningpathService],
})
export class AppModule {}
