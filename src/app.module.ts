import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
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
import { StudyPlanService } from './studyplanner/studyPlan.ai.service';
import { todoModule } from './todo/todo.module';
import { NotesFolderModule } from './notesfolder/notesfolder.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'ewsj',
      password: '8081',
      database: 'ewsj',
      autoLoadEntities: true,
      synchronize: true,
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
    NotesFolderModule
  ],
  controllers: [
    AppController,
    VideosummerizeController,
    LearningpathController,
    StudyPlanController
  ], 
  providers: [
    AppService,
    VideosummerizeService,
    LearningpathService,
    StudyPlanService
  ], // Removed UserService and AuthService
})
export class AppModule {}
