
import { SetMetadata } from '@nestjs/common';

export const RateLimited = (apiName: string) => SetMetadata('apiName', apiName);