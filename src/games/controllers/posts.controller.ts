import { v4 } from 'uuid';

import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  Post,
  UploadedFiles,
  Body,
  Query,
  UseGuards,
  Patch,
  BadRequestException,
  Put,
  Request,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { AdminGuard } from 'src/users/guards/admin.guard';
import {
  AddPostDto,
  DownloadByIdDto,
  DownloadDto,
  RateByIdDto,
  RateDto,
  RemoveDto,
  SearchForAdminDto,
} from '../dtos/posts.dto';
import { extname } from 'path';

import { PostsService } from '../services/posts.service';
import { UserGuard } from 'src/users/guards/user.guard';
import { CommentDto, LikeDto, ReplieDto } from '../dtos/comments.dto';
import { CommentsService } from '../services/comments.service';

@Controller('posts')
export class PostsController {
  constructor(
    public postsService: PostsService,
    public commentsService: CommentsService,
  ) {}

  // returns all posts of a game
  @Get('search/:name/:page?')
  async search(@Param('name') name: string, @Param('page') page: number) {
    return await this.postsService.search(name, page);
  }

  //  returns a spicific post by name and index
  @Get('get/:name/:index')
  async get(@Param('name') name: string, @Param('index') index: number) {
    return await this.postsService.get(name, index);
  }
  
  // search for posts by their names
  @Get('searchByName/:name')
  async searchByName(@Param('name') name: string): Promise<any> {
   return await this.postsService.searchByName(name);
  }

  @Get('getById/:id')
  async getById(@Param('id') id: string) {
    return await this.postsService.getById(id);
  }

  //  auth is done within the service itself
  @UseInterceptors(
    AnyFilesInterceptor(),
  )
  @Post('add')
  async add(@UploadedFiles() files: any, @Body() addPostDto: AddPostDto) {
    return await this.postsService.add(files, addPostDto);
  }

  @Post('download')
  async donwload(@Body() downloadDto: DownloadDto) {
    return await this.postsService.download(downloadDto);
  }

  @Post('downloadById')
  async donwloadById(@Body() downloadByIdDto: DownloadByIdDto) {
    return await this.postsService.downloadById(downloadByIdDto);
  }

  @Post('rate')
  async rate(@Body() rateDto: RateDto) {
    return await this.postsService.rate(rateDto);
  }

  @Post('rateById')
  async rateById(@Body() rateByIdDto: RateByIdDto) {
    return await this.postsService.rateById(rateByIdDto);
  }

  @Get('getCount')
  async getCount(@Query('name') name: string) {
    return await this.postsService.getCount(name);
  }

  @UseGuards(AdminGuard)
  @Post('searchForAdmin/')
  async searchForAdmin(@Body() searchForAdminDto: SearchForAdminDto) {
    return await this.postsService.searchForAdminDto(
      searchForAdminDto.username,
    );
  }

  @UseGuards(AdminGuard)
  @Patch('remove')
  async remove(@Body() removeDto: RemoveDto, @Request() req) {
    const { username } = req.user;
    return await this.postsService.remove(removeDto.id, username);
  }
}
