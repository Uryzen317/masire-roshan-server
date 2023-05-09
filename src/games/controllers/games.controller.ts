import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddGameDto, EditGameDto, DeleteGameDto } from '../dtos/games.dto';
import { GamesService } from '../services/games.service';

@Controller('games')
export class GamesController {
  constructor(public gamesService: GamesService) {}

  @Get('list')
  async list() {
    return await this.gamesService.list();
  }

  @Get('search/:search')
  async search(@Param('search') search: any) {
    return await this.gamesService.search(search);
  }

  //  auth is done in the service itself
  @UseInterceptors(
    FileInterceptor('file'),
  )
  @Post('add')
  async add(@Body() addGameDto: AddGameDto, @UploadedFile() file: any) {
    const { accessToken, title } = addGameDto;
    return await this.gamesService.add(file, title, accessToken);
  }

  //  auth is done in the service itself
  @UseInterceptors(
    FileInterceptor('file'),
  )
  @Patch('edit')
  async edit(@Body() editGameDto: EditGameDto, @UploadedFile() file: any) {
    const { accessToken, title, newTitle } = editGameDto;
    return await this.gamesService.edit(file, title, newTitle, accessToken);
  }

  //  auth is done in the service itself
  @Patch('delete')
  async delete(@Body() deleteGameDto: DeleteGameDto) {
    const { accessToken, title } = deleteGameDto;
    return await this.gamesService.delete(title, accessToken);
  }
}
