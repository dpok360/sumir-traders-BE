import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as JwtPassportStrategy } from 'passport-jwt'; // Passport JWT strategy
import { AuthService } from './auth.service'; // Auth service to validate the user
import { ExtractJwt } from 'passport-jwt'; // Method to extract JWT from the request
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
