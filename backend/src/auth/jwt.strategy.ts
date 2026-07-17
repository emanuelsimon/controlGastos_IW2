import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Esta estrategia de Passport se encarga de validar el JWT enviado en las solicitudes HTTP.
@Injectable() // Ésta clase puede ser inyectada como dependencia en otros lugares del proyecto
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      //El JWT viene en el header Authorization usando el esquema Bearer.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //No acepta tokens expirados. Si el token está expirado, la solicitud será rechazada.
      ignoreExpiration: false,
      //Se verifica la firma del JWT usando la clave secreta definida en las variables de entorno.
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      rol: payload.rol,
    };
  }
}
