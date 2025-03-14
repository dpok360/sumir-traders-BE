import { IsString, IsNotEmpty } from 'class-validator';
import { IsEmailOrPhone } from '../../decorators/emailorphone.decorators';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmailOrPhone() // Use the custom decorator
  emailOrPhoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
