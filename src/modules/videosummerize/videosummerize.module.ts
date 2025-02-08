import { Module } from '@nestjs/common';
import { VideosummerizeController } from './videosummerize.controller';
import { VideosummerizeService } from './videosummerize.service';

@Module({
  controllers: [VideosummerizeController],
  providers: [VideosummerizeService]
})
export class VideosummerizeModule {}
