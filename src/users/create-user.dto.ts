import { IsString, IsEmail, MinLength, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @MinLength(1, { message: 'First name cannot be empty' })
  firstName: string;

  @IsString()
  @MinLength(1, { message: 'Last name cannot be empty' })
  lastName: string;

  @IsString()
  @MinLength(1, { message: 'Address cannot be empty' })
  address: string;

  @IsString()
  @MinLength(1, { message: 'City cannot be empty' })
  city: string;

  @IsString()
  @IsPhoneNumber('NP', { message: 'Invalid phone number format' })
  phoneNumber: string;
}
