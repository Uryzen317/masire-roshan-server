// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { PassportStrategy } from '@nestjs/passport';
// import { Model } from 'mongoose';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { User } from '../models/user.model';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(@InjectModel(User.name) public user: Model<User>) {
//     super({
//       jwtFromRequest: ExtractJwt.fromBodyField('accessToken'),
//       ignoreExpiration: false,
//       secretOrKey: 'secret',
//     });
//   }
//   async validate(payload: any) {
//     let foundUser = await this.user.findOne({ _id: payload.id });
//     let { id, username, avatar } = foundUser;
//     return { id, username, avatar };
//   }
// }
