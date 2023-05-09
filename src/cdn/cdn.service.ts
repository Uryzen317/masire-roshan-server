import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class CdnService {
  download(id, res){
    res.download(join(__dirname, '..', '..', 'cdn', id));
  }
}
