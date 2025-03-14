// src/auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller() // Base route is empty
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { emailOrPhoneNumber, password } = loginDto;

    const user = await this.authService.validateUser(
      emailOrPhoneNumber,
      password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.authService.generateAccessToken(user.id);
    return { accessToken };
  }
}
