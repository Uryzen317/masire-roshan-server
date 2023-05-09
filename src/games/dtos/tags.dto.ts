import { IsString } from 'class-validator';

export class AddTagDto {
  @IsString()
  accessToken: string;

  @IsString()
  title: string;
}

export class EditTagDto {
  @IsString()
  accessToken: string;

  @IsString()
  title: string;

  @IsString()
  newTitle: string;
}

export class DeleteTagDto {
  @IsString()
  accessToken: string;

  @IsString()
  title: string;
}
