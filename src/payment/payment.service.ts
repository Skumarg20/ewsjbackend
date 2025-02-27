import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment } from "entities/payment.entity";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import Razorpay from "razorpay";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PaymentService {
  private razorpay: Razorpay;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>("RAZORPAY_KEY"),
      key_secret: this.configService.get<string>("RAZORPAY_SECRET"),
    });
  }

  async createOrder(createPaymentDto: CreatePaymentDto) {
    const { amount, name, email, phoneNumber, date, exam, message } = createPaymentDto;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await this.razorpay.orders.create(options);

    const parsedDate = new Date(date);

    const newPayment = this.paymentRepository.create({
      orderId: order.id,
      amount,
      name,
      email,
      phoneNumber,
      date: parsedDate,
      exam,
      message: message || "",
      status: "pending",
    });

    await this.paymentRepository.save(newPayment);
    return order;
  }

  async verifyPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) {
    const secretKey = this.configService.get<string>("RAZORPAY_SECRET");
    if (!secretKey) {
      throw new Error("Razorpay secret key is not defined in the configuration");
    }

    const hmac = crypto.createHmac("sha256", secretKey);
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
    const expectedSignature = hmac.digest("hex");

    if (expectedSignature === razorpaySignature) {
      await this.paymentRepository.update(
        { orderId: razorpayOrderId },
        {
          paymentId: razorpayPaymentId,
          signature: razorpaySignature,
          status: "success",
        }
      );

      return { success: true, message: "Payment verified successfully" };
    } else {
      await this.paymentRepository.update(
        { orderId: razorpayOrderId },
        { status: "failed" }
      );

      return { success: false, message: "Payment verification failed" };
    }
  }
}
