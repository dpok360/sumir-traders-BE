import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

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
