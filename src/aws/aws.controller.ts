import {
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { AwsService } from './aws.service';
import { JwtAuthGuard } from 'src/auth/jwt.strategy';
  
  @Controller()
  @UseGuards(JwtAuthGuard)
  export class AwsController {
    constructor(private readonly awsService: AwsService) {}
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
      return this.awsService.uploadFile(file);
    }
  }