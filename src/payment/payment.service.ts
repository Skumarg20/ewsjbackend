import { Injectable, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment } from "entities/payment.entity";
import {  CreatePaymentDto, HindiMediumCourseDto, VerfiyCoursePaymentDto } from "./dto/create-payment.dto";
import Razorpay from "razorpay";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../users/users.service";
import { PlanType } from "enum/plan.enum";
import * as nodemailer from 'nodemailer';

interface RazorpayPayment {
  id: string;
  status: string;
  amount: number; // Explicitly type amount as number
  [key: string]: any; // Allow other properties
}

@Injectable()

export class PaymentService {
  private razorpay: Razorpay;
  private transporter: nodemailer.Transporter;

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

  async createOrderHindiMediumCourse(createOrderDto: HindiMediumCourseDto) {
    const { amount, email } = createOrderDto;

    try {
      const order = await this.razorpay.orders.create({
        amount: amount * 100, 
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });

      return { orderId: order.id, email };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create order');
    }
  }
  
  async verifyPaymentHindiMediumCourse(verifyPaymentDto: VerfiyCoursePaymentDto) {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, email, name } = verifyPaymentDto;

    try {
      // Fetch payment details and explicitly type it
      const payment = (await this.razorpay.payments.fetch(razorpay_payment_id)) as RazorpayPayment;

      if (payment.status !== 'captured') {
        throw new InternalServerErrorException('Payment not captured');
      }

      // Step 2: Verify the payment signature
      const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET')!;
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        throw new InternalServerErrorException('Invalid payment signature');
      }

      const amount:number = payment.amount / 100;

      // Step 3: Send email to user
      const userMailOptions = {
        from: this.configService.get<string>('MAIL_USER'),
        to: email,
        subject: '🚀 Congratulations! Your Journey to Cracking JEE Begins Now!',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2C3E50;">Dear ${name},</h2>
            
            <p>🎉 <strong>Congratulations!</strong> Your payment of <strong>₹${amount}</strong> for the <strong>Hindi Medium JEE Course</strong> has been successfully processed! </p>
            
            <p>You've taken a big step toward achieving your <strong>IIT-JEE dreams</strong>, and we’re thrilled to be part of your journey. Success in JEE requires <strong>dedication, the right strategy, and expert guidance</strong>—and that’s exactly what you’ll get in this course!</p>
      
            <h3 style="color: #27AE60;">📌 Payment Details:</h3>
            <p><strong>✔ Payment ID:</strong> ${razorpay_payment_id}</p>
            <p><strong>✔ Order ID:</strong> ${razorpay_order_id}</p>
      
            <h3 style="color: #2980B9;">📚 What’s Next?</h3>
            <ul>
              <li>📖 <strong>Structured Study Plan:</strong> Get access to <strong>hand-picked study materials, topic-wise PDFs, and video lectures.</strong></li>
              <li>❓ <strong>Doubt-Solving Sessions:</strong> 6 classes per week, ensuring <strong>every concept is crystal clear.</strong></li>
              <li>📈 <strong>Mock Tests & Analysis:</strong> Sharpen your exam skills with weekly tests and detailed performance reviews.</li>
              <li>🌟 <strong>Mentorship & Motivation:</strong> We’ll guide you, <strong>help you stay disciplined, and ensure you never feel lost.</strong></li>
            </ul>
      
            <p style="font-size: 16px;"><strong>🚀 Remember:</strong> Every great journey begins with a single step, and today, you’ve taken yours! Keep pushing forward, stay consistent, and <strong>believe in yourself</strong>—because <strong>YOU CAN CRACK JEE! 💪</strong></p>
      
            <p>Stay tuned! You’ll receive course access details soon. If you have any questions, feel free to reach out.</p>
      
            <p style="font-weight: bold;">Best regards,<br>Hindi Medium JEE Team</p>
          </div>
        `,
      };
      

      // Step 4: Send email to admin
      const adminMailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to: this.configService.get<string>('ADMIN_EMAIL'),
        subject: 'New Payment Received - Hindi Medium JEE Course',
        html: `
          <h2>New Enrollment</h2>
          <p>A user has successfully paid ₹${amount} for the Hindi Medium JEE Course.</p>
          <p><strong>User Name:</strong> ${name}</p>
          <p><strong>User Email:</strong> ${email}</p>
          <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
          <p><strong>Order ID:</strong> ${razorpay_order_id}</p>
        `,
      };

      // Send emails concurrently
      await Promise.all([
        this.transporter.sendMail(userMailOptions),
        this.transporter.sendMail(adminMailOptions),
      ]);

      return { success: true, paymentId: razorpay_payment_id, message: 'Payment verified and emails sent' };
    } catch (error) {
      console.error('Payment verification/email error:', error);
      throw new InternalServerErrorException('Payment processing failed');
    }
  }
  
}