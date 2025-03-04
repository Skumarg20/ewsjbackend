import { Controller, Post, Body, HttpException, HttpStatus,Request, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { JwtAuthGuard } from "src/auth/jwt.strategy";

@Controller("payments")
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("create-order")
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
}
