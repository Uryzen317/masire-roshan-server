import { Controller, 
  Post, 
  Get, 
  UseGuards, 
  Request,
  Body,
  Param,
} from '@nestjs/common';
import { UserGuard } from '../../users/guards/user.guard';
import { BioService } from '../services/bio.service';
import { SetDto } from '../dtos/bio.dto';

@Controller('bio')
export class BioController {
  constructor(public bioService: BioService){}
  
  @UseGuards(UserGuard)
  @Post('set')
  async set(@Body() setDto: SetDto, @Request() req){
    return await this.bioService.set(setDto, req.user)
  }
  
  @Get('get/:id')
  async get(@Param('id') id: string){
    return await this.bioService.get(id);
  }
}
