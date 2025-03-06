
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimitService } from './rate-limit.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly rateLimitService: RateLimitService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; 
    if (!user) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const apiName = this.reflector.get<string>('apiName', context.getHandler());
    const { allowed, remaining, limit } = await this.rateLimitService.checkLimit(
      user.id,
      user.plan,
      apiName,
      user.subscriptionEnd, 
    );

    request['rateLimit'] = { remaining, limit };

    if (!allowed) {
      throw new HttpException(
        {
          message: 'API limit exceeded',
          upgrade: user.plan === 'free' || (user.plan === 'premium' && new Date() > user.subscriptionEnd)
            ? 'Upgrade to premium for more requests'
            : 'Contact support',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}