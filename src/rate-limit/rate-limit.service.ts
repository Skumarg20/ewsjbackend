// src/rate-limit/rate-limit.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { API_LIMITS } from '../../config/api-limits.config';
import {PlanType} from '../../enum/plan.enum';

@Injectable()
export class RateLimitService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async checkLimit(
    userId: string,
    plan: PlanType,
    apiName: string,
    subscriptionEnd?: Date,
  ): Promise<{ allowed: boolean; remaining: number; limit: number }> {
    const now = new Date();
    let effectivePlan = plan;

    if (plan === PlanType.PRO && subscriptionEnd && now > subscriptionEnd) {
      effectivePlan = PlanType.FREE; 
    }

    const key = effectivePlan === PlanType.FREE
      ? `${userId}:${apiName}:${now.toISOString().split('T')[0]}` // Daily key
      : `${userId}:${apiName}:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // Monthly key

    const limit = API_LIMITS[effectivePlan][apiName];
    const ttl = effectivePlan === PlanType.FREE ? 86400*30 : this.getSecondsToNextMonth();

    const currentUsage = parseInt(await this.redis.get(key) || '0', 10);

    if (currentUsage >= limit) {
      return { allowed: false, remaining: 0, limit };
    }

    await this.redis.incr(key);
    await this.redis.expire(key, ttl);
    return { allowed: true, remaining: limit - (currentUsage + 1), limit };
  }

  private getSecondsToNextMonth(): number {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return Math.floor((nextMonth.getTime() - now.getTime()) / 1000);
  }
}