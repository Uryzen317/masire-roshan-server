import { IsString } from 'class-validator';

export class CheckRecaptchaDto {
  @IsString()
  token : string;
}
