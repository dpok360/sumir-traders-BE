import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as JwtPassportStrategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.iterface';

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtPassportStrategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY || 'defaultSecret',
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: userId } = payload;
    const user = await this.authService.validateUserById(userId);

    return user;
  }
}
