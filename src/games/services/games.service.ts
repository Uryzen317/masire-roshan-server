import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from 'src/games/models/game.model';
import { Post } from 'src/games/models/post.model';
import { User } from 'src/users/models/user.model';
import { LogsService } from 'src/users/services/logs.service';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) public game: Model<Game>,
    @InjectModel(Post.name) public post: Model<Post>,
    @InjectModel(User.name) public users: Model<User>,
    public logs: LogsService,
    public jwtService: JwtService,
  ) {}

  async list() {
    let games = await this.game.find();
    return games;
  }

  async search(search: any) {
    let games = await this.game
                .find({ $text: { $search: search } })
                .sort({ $score: { $meta: 'textScore' } })
                .limit(10);
    return games;
  }

  async add(file: any, title: string, accessToken: string) {
    if (!file) throw new BadRequestException();
    if (!title) throw new BadRequestException();

    // auth
    let userAuth = this.jwtService.verify(accessToken, {
      ignoreExpiration: false,
    });

    if (!userAuth) {
      await this.logs.log('add-game failed', 'UNKNOWN', 'UNKNOWN');
      throw new UnauthorizedException();
    }

    // check uniquness
    let game = await this.game.findOne({
      name: title,
    });

    // for logs
    let user = await this.users.findOne({
      _id: userAuth.id,
    });

    if (game) {
      this.logs.log('add-game failed', user.username, user.email);
      throw new BadRequestException();
    }

    await this.game.insertMany([
      {
        name: title,
        avatar: file.filename,
      },
    ]);
    await this.logs.log('add-game', user.username, user.email);

    return {};
  }

  async edit(file: any, title: string, newTitle: string, accessToken: string) {
    // auth
    let userAuth;
    try {
      userAuth = this.jwtService.verify(accessToken, {
        ignoreExpiration: false,
      });
    } catch (error) {
      await this.logs.log('edit-game failed', 'UNKNOWN', 'UNKNOWN');
      throw new BadRequestException({ message: 'خطای اهراز هویت' });
    }

    newTitle = newTitle.trim();

    let query = file
      ? {
          name: newTitle.length && newTitle !== 'null' ? newTitle : title,
          avatar: file.filename,
        }
      : {
          name: newTitle.length && newTitle !== 'null' ? newTitle : title,
        };

    if (!newTitle.length && !file) {
      this.logs.log('edit-game failed', userAuth.username, userAuth.username);
      throw new BadRequestException({
        message: 'فایل یا اسم جدید وارد کنید',
      });
    }
    if (newTitle == 'null' && !file) {
      this.logs.log('edit-game failed', userAuth.username, userAuth.username);
      throw new BadRequestException({
        message: 'فایل یا اسم جدید وارد کنید',
      });
    }

    let game = await this.game.findOneAndUpdate(
      {
        name: title,
      },
      {
        $set: query,
      },
    );

    if (!game) {
      this.logs.log('edit-game failed', userAuth.username, userAuth.username);
      throw new BadRequestException({
        message: 'نام بازی را بدرستی وارد کنید',
      });
    }

    await this.logs.log('edit-game', userAuth.username, userAuth.username);

    return {};
  }

  async delete(title: string, accessToken: string) {
    // auth
    let userAuth = this.jwtService.verify(accessToken, {
      ignoreExpiration: false,
    });

    if (!userAuth) {
      await this.logs.log('delete-game failed', 'UNKNOWN', 'UNKNOWN');
      throw new UnauthorizedException();
    }

    let game = await this.game.findOneAndDelete({
      name: title,
    });

    // for logs
    let user = await this.users.findOne({
      _id: userAuth.id,
    });

    if (!game) {
      this.logs.log('delete-game failed', user.username, user.email);
      throw new BadRequestException();
    }

    await this.logs.log('delete-game', user.username, user.email);

    return {};
  }
}
