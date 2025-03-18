import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/signUp.dto';
import { SignUpResponse } from 'types';
import { AuthService } from 'auth/services/auth.service';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response): Promise<void> {
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
    res.cookie('sumir-trader', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
    res
      .status(HttpStatus.OK)
      .json({ status: 'success', message: 'Login Successfull' });
  }

  @Post('signup')
  async signUp(@Body() signUpDTo: SignUpDto): Promise<SignUpResponse> {
    const response = await this.authService.signUp(signUpDTo);
    return response;
  }
}
