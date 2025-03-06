import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PlanType } from '../../enum/plan.enum';

interface JwtPayload {
  sub: string;
  username: string;
  email: string;
  fullname: string;
  phonenumber: string;
  studentclass: string;
  exam: string;
  plan: PlanType;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  subscriptionDuration?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') ?? 'defaultSecret',
    });
  }

  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
      email: payload.email,
      fullname: payload.fullname,
      phonenumber: payload.phonenumber,
      studentclass: payload.studentclass,
      exam: payload.exam,
      plan: payload.plan,
      subscriptionStart: payload.subscriptionStart ? new Date(payload.subscriptionStart) : undefined,
      subscriptionEnd: payload.subscriptionEnd ? new Date(payload.subscriptionEnd) : undefined,
      subscriptionDuration: payload.subscriptionDuration,
    };
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or missing JWT token');
    }
    return user;
  }
}
