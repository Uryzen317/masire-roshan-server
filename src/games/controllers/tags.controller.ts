import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Request,
  Patch,
} from '@nestjs/common';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { AddTagDto, EditTagDto, DeleteTagDto } from '../dtos/tags.dto';
import { TagsService } from '../services/tags.service';

@Controller('tags')
export class TagsController {
  constructor(public tagsService: TagsService) {}

  @Get('search/:search')
  async search(@Param('search') search: string) {
    return await this.tagsService.search(search);
  }

  @UseGuards(AdminGuard)
  @Post('add')
  async add(@Body() addTagDto: AddTagDto, @Request() req: any) {
    const { title } = addTagDto;
    const { username } = req.user;
    return await this.tagsService.add(title, username);
  }

  @UseGuards(AdminGuard)
  @Patch('edit')
  async edit(@Body() editTagDto: EditTagDto, @Request() req: any) {
    const { title, newTitle } = editTagDto;
    const { username } = req.user;
    return await this.tagsService.edit(title, newTitle, username);
  }

  @UseGuards(AdminGuard)
  @Patch('delete')
  async delete(@Body() deleteTagDto: DeleteTagDto, @Request() req: any) {
    const { title } = deleteTagDto;
    const { username } = req.user;
    return await this.tagsService.delete(title, username);
  }
}
