import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { SignUpResponse } from 'types';
import { SignUpDto } from 'auth/dto/signUp.dto';
import { UsersService } from 'users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateAccessToken(userId: string): Promise<string> {
    const hashedUserId = await bcrypt.hash(userId, 10);
    const token: string = this.jwtService.sign(
      { sub: hashedUserId },
      { expiresIn: '7d' },
    );
    return token;
  }

  async validatePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async validateUser(
    phoneOrEmail: string,
    plainTextPassword: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOne(phoneOrEmail);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.validatePassword(
      plainTextPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async validateUserById(userId: string): Promise<User | null> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async checkIfUserExist(email: string, phoneNumber: string): Promise<boolean> {
    const userExist = await this.usersService.findUserByEmailOrPhone(
      email,
      phoneNumber,
    );
    return userExist;
  }

  async signUp(signUpDto: SignUpDto): Promise<SignUpResponse> {
    const { email, phoneNumber, password } = signUpDto;
    const userExist = await this.usersService.findUserByEmailOrPhone(
      email,
      phoneNumber,
    );

    if (userExist) {
      throw new ConflictException(
        'User with this email or phone number already exists',
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersService.createUser(signUpDto, hashedPassword);
    return {
      statusCode: 201,
      message: 'User created successfully. Please sign in.',
    };
  }
}
