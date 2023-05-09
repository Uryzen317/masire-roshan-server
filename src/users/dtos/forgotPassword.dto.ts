import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, {message : 'ایمیل معتبر نیست'})
  email : string;
}
