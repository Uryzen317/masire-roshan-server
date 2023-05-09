import { IsString, IsNumber, Min, Max } from 'class-validator';

export class ConfirmEmailDto{
  @IsString()
  accessToken : string;

  @IsNumber()
  @Min(0)
  @Max(99999)
  key : number;
}
