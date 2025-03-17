import { User as PrismaUser } from '@prisma/client';

export type UserWithoutPassword = Omit<PrismaUser, 'password'>;

export interface SignUpResponse {
  statusCode: number;
  message: string;
  data?: any;
}
