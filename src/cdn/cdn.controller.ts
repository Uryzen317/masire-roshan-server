import { 
  Controller,
  Get,
  Res,
  Param,
} from '@nestjs/common';
import { CdnService } from './cdn.service';

@Controller('cdn')
export class CdnController {
  constructor(public cdnService: CdnService){}
  
  @Get(':id')
  download(@Param('id') id, @Res() res){
    this.cdnService.download(id, res);
  }
}
