import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment } from "entities/payment.entity";
import {  CreatePaymentDto } from "./dto/create-payment.dto";
import Razorpay from "razorpay";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../users/users.service";
import { PlanType } from "enum/plan.enum";

@Injectable()

export class PaymentService {
  private razorpay: Razorpay;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly userService: UserService // Inject UserService
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>("RAZORPAY_KEY"),
      key_secret: this.configService.get<string>("RAZORPAY_SECRET"),
    });
  }

  async createOrder(createPaymentDto: CreatePaymentDto, userId: string) {
    const { amount, date, plan } = createPaymentDto;
  console.log(createPaymentDto,userId);
    if (!userId || !plan) {
      throw new BadRequestException("userId and plan are required for order creation");
    }
  
 
    const user = await this.userService.findOneById(userId);
    console.log(user);
    if (!user) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }
  
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
      payment_capture: 1,
      notes: { userId, plan }, 
    };
  
    const order = await this.razorpay.orders.create(options);
    console.log(order,options,"-----");
    const parsedDate = new Date(date);
  
    // Create payment with user relation
    const newPayment = this.paymentRepository.create({
      orderId: order.id,
      amount,
      date: parsedDate,
      status: "pending",
      plan,
      user, 
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
  
    const payment = await this.paymentRepository.findOne({
      where: { orderId: razorpayOrderId },
      relations: ["user"], 
      select: {
        id: true, 
        orderId: true,
        paymentId: true,
        signature: true,
        amount: true,
        status: true,
        date: true,
        plan: true,
        user: {
          id: true, 
        },
      }, 
    });
  
    if (!payment) {
      throw new BadRequestException("Payment record not found");
    }
  
    console.log(payment, "this is payment");
  
    if (expectedSignature === razorpaySignature) {
      await this.paymentRepository.update(
        { orderId: razorpayOrderId },
        {
          paymentId: razorpayPaymentId,
          signature: razorpaySignature,
          status: "success",
          updatedAt: new Date(),
        }
      );
  
    
      const updatedPayment = await this.paymentRepository.findOne({ where: { orderId: razorpayOrderId } });
      console.log(updatedPayment, "Updated payment details");
  

      const planDurations = {
        [PlanType.FREE]: 30, 
        [PlanType.BASIC]: 30, 
        [PlanType.PRO]: 30, 
        [PlanType.ULTIMATE]: 30, 
      };
  
      const durationDays = planDurations[payment.plan] || 30;
  
      if (!payment.user) {
        throw new BadRequestException("User not found for this payment record");
      }
  
      const updatedUser = await this.userService.updateUserPlan(payment.user.id, payment.plan, durationDays);
      console.log(updatedUser, "this is updated user");
  
      return {
        success: true,
        message: `Payment verified and plan updated to ${updatedUser.plan} successfully`,
        user: updatedUser,
      };
    } else {
      await this.paymentRepository.update(
        { orderId: razorpayOrderId },
        { status: "failed", updatedAt: new Date() }
      );
  
      return { success: false, message: "Payment verification failed" };
    }
  }

  
  
}