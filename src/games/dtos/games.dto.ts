import { IsString } from 'class-validator';

export class AddGameDto {
  @IsString()
  accessToken: string;

  @IsString()
  title: string;
}

export class EditGameDto {
  @IsString()
  accessToken: string;

  @IsString()
  title: string;

  @IsString()
  newTitle: string;
}

export class DeleteGameDto {
  @IsString()
  accessToken: string;

  @IsString()
  title: string;
}
