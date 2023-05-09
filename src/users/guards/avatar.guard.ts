// import {
//   BadRequestException,
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { async, Observable } from 'rxjs';
// import { User } from '../models/user.model';

// @Injectable()
// export class avatarGuard implements CanActivate {
//   constructor(
//     @InjectModel(User.name) public users: Model<User>,
//     public jwtService: JwtService,
//   ) {}
//   async canActivate(context: ExecutionContext): Promise<any> {
//     let req = context.switchToHttp().getRequest();
//     let headers = req.headers;

//     if (headers['content-type']?.split(';')[0] !== 'multipart/form-data')
//       throw new BadRequestException();

//     let clone = req;

//     clone.forEach(async (value) => {
//       try {
//         let accessToken = value
//           .toString()
//           .split('------')[2]
//           .split('\n')[3]
//           .trim();

//         if (!accessToken) throw new UnauthorizedException();

//         let user = this.jwtService.verify(accessToken, {
//           ignoreExpiration: false,
//         });
//         if (!user) throw new UnauthorizedException();

//         let foundUser = await this.users.findOne({ _id: user.id });
//         if (!foundUser) throw new UnauthorizedException();

//         let { id, username, avatar } = foundUser;
//         context.switchToHttp().getRequest().user = {
//           id,
//           username,
//           avatar,
//         };
//       } catch (error) {
//         console.log(error);
//       }
//     });

//     return true;
//   }
// }
