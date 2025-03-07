import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VideosummerizeService } from './modules/videosummerize/videosummerize.service';
import { VideosummerizeController } from './modules/videosummerize/videosummerize.controller';
import { LearningpathModule } from './modules/learningpath/learningpath.module';
import { LearningpathController } from './modules/learningpath/learningpath.controller';
import { LearningpathService } from './modules/learningpath/learningpath.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CalendarModule } from './calender/calendar.module';
import { NotesModule } from './notes/notes.module';
import { TimetableModule } from './timetable/timetable.module';
import { ChatModule } from './chat/chat.module';
import { StudyPlanController } from './studyplanner/studyplanner.controller';
import { StudyPlanService } from './studyplanner/studyplan.service';
import { todoModule } from './todo/todo.module';
import { NotesFolderModule } from './notesfolder/notesfolder.module';
import { AwsController } from './aws/aws.controller';
import { AwsService } from './aws/aws.service';
import { StudyPlanModule } from './studyplanner/studyplan.module';
import { PaymentModule } from './payment/payment.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RateLimitService } from './rate-limit/rate-limit.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), 
    RedisModule.forRootAsync({
      imports: [ConfigModule],
    
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        options: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          type: 'mysql' as const, 
          host: configService.get<string>('DATABASE_HOST', 'localhost'),
          port: configService.get<number>('DATABASE_PORT', 3306),
          username: configService.get<string>('DATABASE_USERNAME', 'root'),
          password: configService.get<string>('DATABASE_PASSWORD', '8081'),
          database: configService.get<string>('DATABASE_NAME', 'ewsj'),
          autoLoadEntities: true,
          synchronize: true, 
        };
        return dbConfig;
      },
      inject: [ConfigService],
    }),
    LearningpathModule,
    UserModule,
    AuthModule, 
    CalendarModule,
    NotesModule,
    TimetableModule,
    ChatModule,
    todoModule,
    NotesModule,
    NotesFolderModule,
    StudyPlanModule,
    PaymentModule,
  ],
  controllers: [
    AwsController,
    AppController,
    VideosummerizeController,
    LearningpathController,
  ], 
  providers: [
    AppService,
    RateLimitService,
    AwsService,
    VideosummerizeService,
    LearningpathService,
    RateLimitService,
  ],
})
export class AppModule {}