import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule} from '@nestjs/typeorm';
import { ConfigService, ConfigType } from '@nestjs/config';
import { SeguridadController } from './controllers/seguridad.controller';
import { SeguridadService } from './services/seguridad.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy'
import {Empleado} from './entities/empleado.entity';
import config from '../../config';

@Module({
  imports:[
    PassportModule,
    TypeOrmModule.forFeature([Empleado]),
    JwtModule.registerAsync({
    inject: [config.KEY],
    useFactory: (configService: ConfigType<typeof config>) => {
      return {
        secret: configService.jwtSecret,
        signOptions: {
          expiresIn: '1d',
        },
      }
    },
  })],
  controllers: [SeguridadController],
  providers: [SeguridadService, LocalStrategy, JwtStrategy]
})
export class SeguridadModule {}
