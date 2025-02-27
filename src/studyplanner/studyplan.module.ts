import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudyPlan } from "entities/studyplan.entity";
import { StudyPlanService } from "./studyplan.service";
import { StudyPlanController } from "./studyplanner.controller";
import { ConfigModule } from "@nestjs/config";


@Module({
    imports:[TypeOrmModule.forFeature([StudyPlan]),ConfigModule],
    providers:[StudyPlanService,TypeOrmModule],
    controllers:[StudyPlanController],
})
export class StudyPlanModule {}