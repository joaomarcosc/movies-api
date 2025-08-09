import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload, ValidatedUser } from 'src/types/jwt.types';

@Injectable()
export default class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret =
      configService.get<string>('jwt.secret') ||
      configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      throw new Error('JWT secret is not defined in the configuration.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: JwtPayload): ValidatedUser {
    return { userId: payload.sub, email: payload.email };
  }
}
