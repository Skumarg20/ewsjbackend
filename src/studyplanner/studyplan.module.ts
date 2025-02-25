import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StudyPlan } from "entities/studyplan.entity";
import { StudyPlanService } from "./studyplan.service";
import { StudyPlanController } from "./studyplanner.controller";


@Module({
    imports:[TypeOrmModule.forFeature([StudyPlan])],
    providers:[StudyPlanService,TypeOrmModule],
    controllers:[StudyPlanController],
})
export class StudyPlanModule {}