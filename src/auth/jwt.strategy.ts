import { Injectable, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGuard } from '@nestjs/passport';

interface JwtPayload {
  sub: string;
  username: string;
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
      username: payload.username 
    };
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
