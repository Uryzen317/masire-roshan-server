import {
  IsBoolean,
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(5)
  @MaxLength(74)
  username: string;

  @IsEmail()
  @MinLength(5)
  @MaxLength(74)
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(64)
  password: string;

  @IsBoolean()
  rememberme: boolean;
}
