import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { SeguridadService } from '../services/seguridad.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private seguridadService: SeguridadService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.seguridadService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Usuario no autorizado');
    }
    return user;
  }
}