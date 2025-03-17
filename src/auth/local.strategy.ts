import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'phoneOrEmail',
      passwordField: 'plainTextPassword',
    });
  }

  async validate(
    phoneOrEmail: string,
    plainTextPassword: string,
  ): Promise<User | null> {
    return await this.authService.validateUser(phoneOrEmail, plainTextPassword);
  }
}
