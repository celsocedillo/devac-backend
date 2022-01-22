import { NestFactory } from '@nestjs/core';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  console.log('Arrancando app');
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService)
  app.enableCors();
  await app.listen(configService.get('config').serverPort);
  //await app.listen('0.0.0.0:3050');
  console.log('PUERTO EJECUCION', configService.get('config').serverPort);
  console.log('BASE DE DATOS', configService.get('config').oracle.sid);

}
bootstrap();

