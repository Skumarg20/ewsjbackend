import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WsAdapter } from '@nestjs/platform-ws';
import { IoAdapter } from '@nestjs/platform-socket.io';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', 
    credentials: true,
  });
  app.enableCors();
  
  app.useWebSocketAdapter(new IoAdapter(app))
  const configService = app.get(ConfigService);
  const port =configService.get<number>('PORT') ||3000;
  console.log(port);
  await app.listen(port);
}
bootstrap();
