import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3050,'0.0.0.0');
  //await app.listen(3050);
  //await app.listen('0.0.0.0:3050');
}
bootstrap();

