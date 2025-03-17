import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signUp.dto';
import { SignUpResponse } from 'types';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { emailOrPhoneNumber, password } = loginDto;
    if (!emailOrPhoneNumber || !password) {
      throw new UnauthorizedException(
        'Email or phone number or password  is required',
      );
    }

    const user = await this.authService.validateUser(
      emailOrPhoneNumber,
      password,
    );

    const accessToken = await this.authService.generateAccessToken(user!.id);
    return { accessToken };
  }

  @Post('signup')
  async signUp(@Body() signUpDTo: SignUpDto): Promise<SignUpResponse> {
    const response = await this.authService.signUp(signUpDTo);
    return response;
  }
}
