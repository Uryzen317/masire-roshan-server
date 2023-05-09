import { IsNumber, IsString, Min, Max } from 'class-validator';

export class EditMainPageDto {
  @IsString()
  accessToken: string;

  @IsString()
  title: string;

  @IsNumber()
  @Min(0)
  @Max(14)
  index: number;

  @IsString()
  primaryColor: string;

  @IsString()
  secondaryColor: string;
  
  @IsNumber()
  @Min(0)
  @Max(1)
  type: number;
}
