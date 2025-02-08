import { Body, Controller, Get, Post } from '@nestjs/common';
import { VideosummerizeService } from './videosummerize.service';
@Controller('videosummerize')
export class VideosummerizeController {
    constructor(private readonly videosummerizeService: VideosummerizeService) {}

     @Get()
     async gethello(){
            return "Hello World";
     }
    @Post()
    async summarizeVideoTranscript(@Body('videoUrl') videoUrl:string): Promise<string> {
        const transcript = await this.videosummerizeService.getVideoTranscript(videoUrl);
        const summary = await this.videosummerizeService.summarizeText(transcript);
        return summary;
    }


}
