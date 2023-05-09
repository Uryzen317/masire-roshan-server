import { IsString, MinLength } from 'class-validator';

export class CommentDto {
  @IsString()
  @MinLength(1)
  comment: string;

  @IsString()
  accessToken: string;

  @IsString()
  postId: string;
}

export class LikeDto {
  @IsString()
  accessToken: string;

  @IsString()
  commentId: string;
}

export class ReplieDto {
  @IsString()
  accessToken: string;

  @IsString()
  commentId: string;

  @IsString()
  replie: string;
}
