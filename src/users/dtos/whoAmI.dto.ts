import { IsString } from 'class-validator';

export class WhoAmIDto {
  @IsString()
  accessToken: string;
}
