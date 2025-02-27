import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "../../entities/payment.entity";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), ConfigModule],
  controllers: [PaymentController],
  providers: [PaymentService,TypeOrmModule],
  exports: [PaymentService],
})
export class PaymentModule {}
