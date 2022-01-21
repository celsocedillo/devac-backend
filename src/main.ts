import { NestFactory } from '@nestjs/core';
import { ConfigService, ConfigType } from '@nestjs/config';
import { AppModule } from './app.module';
import config from './config';

async function bootstrap() {
  
  //console.log('Puerto de ejecucion', this.configService.oracle.host);
  //const app = await NestFactory.create(AppModule, {cors: true});
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService)
  console.log('PUERTO EJECUCION', configService.get('config').serverPort);
  console.log('BASE DE DATOS', configService.get('config').oracle.host);
  app.enableCors();
  //await app.listen(3060,'0.0.0.0');
  await app.listen(configService.get('config').serverPort,'0.0.0.0');
  //await app.listen(configService.get('config').serverPort);
  //await app.listen('0.0.0.0:3050');
}
bootstrap();

