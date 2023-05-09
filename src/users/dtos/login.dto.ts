import { IsBoolean, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(5)
  @MaxLength(74)
  username: string;

  @IsString()
  @MinLength(5)
  @MaxLength(64)
  password: string;

  @IsBoolean()
  rememberme: boolean;
}
