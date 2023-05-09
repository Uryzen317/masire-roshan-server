import { CommentsService } from "../services/comments.service";
import { Controller, Request, Body, Put, UseGuards, Param, Get, Post } from "@nestjs/common";
import { CommentDto, LikeDto } from "../dtos/comments.dto";
import { UserGuard } from "../../users/guards/user.guard";

@Controller("comments")
export class CommentsController {
  constructor(public commentsService : CommentsService){}

  @UseGuards(UserGuard)
  @Put("comment")
  async comment(@Body() commentDto: CommentDto, @Request() req) {
    return await this.commentsService.comment(commentDto , req.user.id);
  }

  @Get('list/:postId/:accessToken?')
  async list(
    @Param('postId') postId: string,
    @Param('accessToken') accessToken: string,
  ) {
    return await this.commentsService.list(postId, accessToken);
  }

  @UseGuards(UserGuard)
  @Post('like')
  async like(@Body() likeDto: LikeDto, @Request() req) {
    return await this.commentsService.like(likeDto, req.user.id);
  }

  @UseGuards(UserGuard)
  @Post('dislike')
  async dislike(@Body() likeDto: LikeDto, @Request() req) {
    return await this.commentsService.dislike(likeDto, req.user.id);
  }

  // @UseGuards(UserGuard)
  // @Put('replie')
  // async replie(@Body() replieDto: ReplieDto, @Request() req) {
  //   return await this.commentsService.replie(replieDto, req.user.id);
  // }

  // @Get('repliesList/:postId/:accessToken?')
  // async repliesList(
  //   @Param('postId') postId: string,
  //   @Param('accessToken') accessToken: string,
  // ) {
  //   return await this.commentsService.repliesList(postId, accessToken);
  // }

  // @UseGuards(UserGuard)
  // @Post('likeReplie')
  // async likeReplie(@Body() likeDto: likeDto, @Request() req) {
  //   return await this.commentsService.likeReplie(likeDto, req.user.id);
  // }

  // @UseGuards(UserGuard)
  // @Post('dislikeReplie')
  // async dislikeReplie(@Body() likeDto: likeDto, @Request() req) {
  //   return await this.commentsService.dislikeReplie(likeDto, req.user.id);
  // }
}
