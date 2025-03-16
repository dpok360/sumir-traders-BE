import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateAccessToken(userId: string): Promise<string> {
    const hashedUserId = await bcrypt.hash(userId, 10);
    const token: string = this.jwtService.sign({ sub: hashedUserId });
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
}
