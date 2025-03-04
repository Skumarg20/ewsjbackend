import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudyPlan } from "entities/studyplan.entity";
import { StudyPlanService } from "./studyplan.service";
import { StudyPlanController } from "./studyplanner.controller";
import { ConfigModule } from "@nestjs/config";
import { RateLimitService } from "src/rate-limit/rate-limit.service";
import { RateLimitGuard } from "src/rate-limit/rate-limit.guard";


@Module({
    imports:[TypeOrmModule.forFeature([StudyPlan]),ConfigModule],
    providers:[StudyPlanService,TypeOrmModule,RateLimitService,RateLimitGuard],
    controllers:[StudyPlanController],
})
export class StudyPlanModule {}