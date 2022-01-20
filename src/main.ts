import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule, {cors: true});
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3060,'0.0.0.0');
  //await app.listen(3060);
  //await app.listen('0.0.0.0:3050');
}
bootstrap();

