import * as bcrypt from 'bcryptjs'; // Mock bcrypt
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
describe('AuthService', () => {
  let authService: AuthService;
  const mockBcryptCompare = bcrypt.compare as jest.Mock;
  const mockBcryptHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
  const mockUsersService = {
    findOne: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockJwtToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'hashedPassword',
        address: '123 Main St',
        city: 'Somewhere',
        phoneNumber: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockBcryptCompare.mockResolvedValue(true); // Simulate successful password match

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      );

      if (result) {
        expect(result.id).toBe(mockUser.id);
        expect(result.email).toBe(mockUser.email);
      } else {
        throw new Error('Result is null');
      }

      expect(result).toBeDefined();
      expect(mockUsersService.findOne).toHaveBeenCalledWith('test@example.com');
      expect(mockBcryptCompare).toHaveBeenCalledWith(
        'password',
        'hashedPassword',
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(
        authService.validateUser('nonexistent@example.com', 'password'),
      ).rejects.toThrowError(new UnauthorizedException('Invalid credentials'));
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashed-password',
        address: '123 Main St',
        city: 'Somewhere',
        phoneNumber: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockBcryptCompare.mockResolvedValue(false); // Simulate password mismatch

      await expect(
        authService.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrowError(new UnauthorizedException('Invalid credentials'));
    });
  });

  it('should mock bcrypt.hash correctly', async () => {
    const userId = '12345';
    const hashedUserId = 'hashed12345';
    mockBcryptHash.mockResolvedValue(hashedUserId);

    const token = await authService.generateAccessToken(userId);

    expect(token).toBe('mockJwtToken');
    expect(bcrypt.hash).toHaveBeenCalledWith(userId, 10);
  });

  describe('validateUserById', () => {
    it('should return user if valid ID is provided', async () => {
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashed-password',
        address: '123 Main St',
        city: 'Somewhere',
        phoneNumber: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await authService.validateUserById('1');

      expect(result).toBeDefined();
      if (result) {
        expect(result.id).toBe(mockUser.id);
        expect(result.email).toBe(mockUser.email);
      } else {
        throw new Error('Result is null');
      }

      expect(result.id).toBe(mockUser.id);
      expect(mockUsersService.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user is not found', async () => {
      // Mock the findById method to return null (user not found)
      mockUsersService.findById.mockResolvedValue(null);

      // Check if the method throws a NotFoundException
      await expect(authService.validateUserById('999')).rejects.toThrow(
        new NotFoundException('User with ID 999 not found'),
      );
    });
  });
});
