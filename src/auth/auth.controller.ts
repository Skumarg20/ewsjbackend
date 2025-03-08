import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get() 
  async test(){
    return "gekllo brp"
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    console.log(signUpDto);
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Request() req) {
    
    return this.authService.signIn(req.user);
  }
  @Post('request-reset')
  async requestReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }
  @Post('verify-code')
  async verifyCode(@Body() body: { email: string; otp: string }) {
    
    return this.authService.verifyResetCode(body.email, body.otp);
  }
  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; otp: string; newPassword: string }) {
    return this.authService.resetPassword(body.email, body.otp, body.newPassword);
  }
  

}