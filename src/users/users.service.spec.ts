import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let mockPrismaService: PrismaService; // Corrected variable declaration

  const mockPrismaServiceValue = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaServiceValue,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockPrismaService = module.get<PrismaService>(PrismaService); // Use the correct variable name
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
