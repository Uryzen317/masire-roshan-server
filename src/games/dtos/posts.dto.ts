import { Type } from 'class-transformer';
import { IsDefined, IsString, IsNumber, Min, Max } from 'class-validator';

export class AddPostDto {
  @IsString()
  title: string;
  
  @IsString()
  name: string;

  @IsString()
  desc: string;

  @IsDefined()
  fields: any;
  
  @IsDefined()
  tags: any;

  @IsString()
  copyright: string;

  @IsString()
  accessToken: string;
}

export class DownloadDto {
  @IsNumber()
  index: number;

  @IsString()
  name: string;
}

export class DownloadByIdDto {
  @IsString()
  id: string;
}

export class RateDto {
  @IsNumber()
  index: number;

  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rate: number;
}

export class RateByIdDto {
  @IsString()
  id: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rate: number;
}

export class SearchForAdminDto{
  @IsString()
  accessToken : string ;

  @IsString()
  username : string;
}

export class RemoveDto{
  @IsString()
  accessToken : string ;

  @IsString()
  id : string;
}
