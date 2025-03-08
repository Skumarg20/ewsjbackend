import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private frontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL', 'https://yourfrontend.com');

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false, // Secure true for port 465, false for 587
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendPasswordResetEmail(email: string, otp: string) {
    await this.transporter.sendMail({
      from: `"Your App" <${this.configService.get<string>('MAIL_USER')}>`,
      to: email,
      subject: 'Password Reset Code',
      html: `
        <p>You requested a password reset.</p>
        <p>Your 6-digit verification code is:</p>
        <h2>${otp}</h2>
        <p>This code is valid for 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }
}
