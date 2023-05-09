import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models/user.model';

@Injectable()
export class GodGuard implements CanActivate {
  constructor(
    public jwtService: JwtService,
    @InjectModel(User.name) public users: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    let accessToken = context.switchToHttp().getRequest().body.accessToken;
    if (!accessToken) throw new UnauthorizedException();
    try {
      let user = this.jwtService.verify(accessToken, {
        ignoreExpiration: false,
      });

      if (!user) throw new UnauthorizedException();

      let foundUser = await this.users.findOne({ _id: user.id });
      if (!foundUser) throw new UnauthorizedException();
      let { id, username, avatar, role, isGoogleAvatar } = foundUser;

      if(role !== 'god') throw new BadRequestException()

      context.switchToHttp().getRequest().user = {
        id,
        username,
        avatar,
        role,
        isGoogleAvatar
      };
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
