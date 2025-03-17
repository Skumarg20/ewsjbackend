import { Controller, Post, Body, HttpException, HttpStatus,Request, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto, HindiMediumCourseDto, VerfiyCoursePaymentDto } from "./dto/create-payment.dto";
import { JwtAuthGuard } from "src/auth/jwt.strategy";
import { LocalAuthGuard } from "src/auth/local-auth.guard";

@Controller("payments")

export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("create-order")
  @UseGuards(LocalAuthGuard)
  async createOrder(@Body() createPaymentDto: CreatePaymentDto,@Request() req) {
    const userId=req.user.userId;
    console.log(req.user,"this is user");
    console.log(createPaymentDto,userId,"this is id");
    try {
      const order = await this.paymentService.createOrder(createPaymentDto,userId);
      return { success: true, order };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post("verify-payment")
  @UseGuards(LocalAuthGuard)
  async verifyPayment(@Body() body: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) {
    console.log(body,"this is veryiypayent");
    try {
      const result = await this.paymentService.verifyPayment(
        body.razorpayOrderId,
        body.razorpayPaymentId,
        body.razorpaySignature
      );
      console.log(result,"this is verify result");
      return result;
    } catch (error) {
      console.log(error,"this is error");
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('create-order-hindimedium')
  async createOrderHindiMediumCourse(@Body() createHindiMediumCourseDto:HindiMediumCourseDto){
    return await this.paymentService.createOrderHindiMediumCourse(createHindiMediumCourseDto);
  }
  @Post('verify-hindimedium-payment')
  async verifyPaymentHindiMediumCourse(@Body() verfiyHindimediumCourseDto:VerfiyCoursePaymentDto){
    return await this.paymentService.verifyPaymentHindiMediumCourse(verfiyHindimediumCourseDto);
  }

}
