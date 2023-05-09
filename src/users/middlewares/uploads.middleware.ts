import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class UploadsMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.headers['content-type'].split(';')[0] === 'multipart/form-data') {
      //a multipart formdata request
      let accessToken;
      req.forEach((element) => {
        let tempToken = element
          .toString()
          .split('------')[2]
          .split('\n')[3]
          .trim();

        if (tempToken) {
          req.body = {
            accessToken: tempToken,
          };
        }
      });
      next();
    } else {
      //a simple json request
      next();
    }
  }
}
