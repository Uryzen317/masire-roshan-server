import {
  Controller,
  Post,
  UseGuards,
  Body,
  Request,
  Get,
} from '@nestjs/common';
import { AdminGuard } from 'src/users/guards/admin.guard';
import { EditMainPageDto } from '../dtos/mainPage.dto';
import { MainPageService } from '../services/mainPage.service';

@Controller('mainPage')
export class MainPageController {
  constructor(public mainPageService: MainPageService) {}

  @UseGuards(AdminGuard)
  @Post('edit')
  async edit(@Body() editMainPageDto: EditMainPageDto, @Request() req) {
    return await this.mainPageService.edit(editMainPageDto, req.user.username);
  }

  @Get('list')
  async list() {
    return await this.mainPageService.list();
  }
}
