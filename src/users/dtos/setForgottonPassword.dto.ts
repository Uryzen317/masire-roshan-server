import { IsString, MinLength, MaxLength } from 'class-validator';

export class SetForgottonPasswordDto {
  @IsString()
  token : string;

  @IsString()
  @MinLength(5)
  @MaxLength(64)
  password : string
}
