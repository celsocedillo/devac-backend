import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeneralesModule } from './modulos/generales/generales.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { enviroments } from './enviroments';
import { SeguridadModule } from './modulos/seguridad/seguridad.module';
import { CorrespondenciaModule } from './modulos/correspondencia/correspondencia.module';
import { ActivosModule } from './modulos/activos/activos.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      //envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      envFilePath: '.env',
      load: [config],
      isGlobal: true,
      
    }),
    GeneralesModule, 
    DatabaseModule, SeguridadModule, CorrespondenciaModule, ActivosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
