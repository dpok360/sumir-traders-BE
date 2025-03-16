import { IsString, IsNotEmpty, IsDefined } from 'class-validator';
import { IsEmailOrPhone } from '../../decorators/emailorphone.decorators';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @IsEmailOrPhone()
  emailOrPhoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  password?: string;
}
