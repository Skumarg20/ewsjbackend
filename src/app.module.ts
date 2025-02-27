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
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('SQL_HOST', 'localhost'),
        port: configService.get<number>('SQL_PORT', 3306),
        username: configService.get<string>('SQL_USERNAME', 'root'),
        password: configService.get<string>('SQL_PASSWORD', ''),
        database: configService.get<string>('SQL_DATABASE', 'default_db'),
        autoLoadEntities: true,
        synchronize: true,
      }),
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
    PaymentModule
  ],
  controllers: [
    AwsController,
    AppController,
    VideosummerizeController,
    LearningpathController,
    
  ], 
  providers: [
    AppService,
    AwsService,
    VideosummerizeService,
    LearningpathService,
    
  ], // Removed UserService and AuthService
})
export class AppModule {}
