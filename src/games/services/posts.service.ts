import * as sharp from 'sharp';
import { v4 } from 'uuid';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/games/models/post.model';
import { Model } from 'mongoose';
import { Game } from 'src/games/models/game.model';
import { LogsService } from 'src/users/services/logs.service';
import { JwtService } from '@nestjs/jwt';
import {
  AddPostDto,
  DownloadByIdDto,
  DownloadDto,
  RateByIdDto,
  RateDto,
} from '../dtos/posts.dto';
import { User } from 'src/users/models/user.model'

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) public post: Model<Post>,
    @InjectModel(User.name) public user: Model<User>,
    @InjectModel(Game.name) public game: Model<Game>,
    public logs: LogsService,
    public jwtService: JwtService,
  ) {}

  async search(name: string, page: number) {
    // validating the game name by database
    // getting the id of game
    // (the process of getting game id could have been done in front , in search section though it would have resulted in a slower response of server)
    let game = await this.game.findOne({
      name,
    });

    if (!game) throw new NotFoundException();

    if (!page) page = 0;

    return await this.post
      .find({ game: game._id })
      .skip(page * 60) // 60 = number of the posts if page
      .limit(60);
  }
  
  async searchByName(name: string): Promise<Post[]> {
    return await this.post.find({ $text: { $search: name }}).sort({ $score: { $meta: 'textScore' } }).limit(10);
  }

  async get(name: string, index: number) {
    // validating the game name by database
    // getting the id of game
    // (the process of getting game id could have been done in front , in search section though it would have resulted in a slower response of server)
    let game = await this.game.findOne({
      name,
    });

    if (!game) throw new NotFoundException();

    let post: any = await this.post
      .findOne({
        game: game._id,
      })
      .skip(index)
      .populate('author');

    if (!post) throw new NotFoundException();

    let {
      copyright,
      downloads,
      comments,
      files,
      avatar,
      smallAvatar,
      updatedAt,
      rating,
      _id,
    } = post;

    return {
      author: post.author.username,
      copyright: copyright == 'public' ? 'عمومی' : 'خصوصی',
      rating,
      downloads,
      comments,
      files,
      avatar,
      smallAvatar,
      updatedAt,
      _id,
      authorId: post.author._id,
      title : post.name,
    };
  }

  async getById(id: string) {
    // validating the game name by database
    // getting the id of game
    // (the process of getting game id could have been done in front , in search section though it would have resulted in a slower response of server)

    let post: any = await this.post
      .findOne({
        _id: id,
      })
      .populate('author');

    if (!post) throw new NotFoundException();

    let {
      copyright,
      downloads,
      comments,
      files,
      avatar,
      smallAvatar,
      updatedAt,
      rating,
      tags,
      desc,
    } = post;

    return {
      author: post.author.username,
      copyright: copyright == 'public' ? 'عمومی' : 'خصوصی',
      rating,
      downloads,
      comments,
      files,
      avatar,
      smallAvatar,
      updatedAt,
      _id : id,
      tags,
      authorId: post.author._id,
      desc,
      title : post.name,
    };
  }

  async add(files: any, addPostDto: AddPostDto) {
    let { accessToken, title, desc, copyright, fields, tags, name } = addPostDto;
    tags = JSON.parse(tags);
    if(!Array.isArray(tags) || tags.length == 0){
      tags = [];
    }
    
    let user ;
    // verify token
    try {
      user = this.jwtService.verify(accessToken, { ignoreExpiration: false });
    } catch (error) {
      this.logs.log('add-post failed', 'UNKNON', 'UNKNOWN');
      throw new UnauthorizedException();
    }
    // verify files
    let avatar = files.find((element) => {
      return element.fieldname == 'avatar';
    });
    if (!avatar || !desc || !title) {
      await this.logs.log('add-post failed', user.username, user.username);
      throw new BadRequestException();
    };

    fields = JSON.parse(fields).map((field) => {
      let fieldPath = files.find((file) => {
        file.fieldname = Buffer.from(file.fieldname, 'latin1').toString(
          'utf-8',
        );
        return file.fieldname == field.name;
      });

      return {
        title: field.title,
        type: field.type,
        path: fieldPath.filename,
      };
    });

    // creating an small optimized avatar for post
    let smallAvatar = v4() + '.jpg';
    try{
      await sharp(avatar.path)
        .resize(500, 300)
        .toFile(`./cdn/${smallAvatar}`);
    }catch(error){
      await this.logs.log('add-post failed', user.username, user.username);
      throw new BadRequestException();
    }

    await this.post.insertMany([
      {
        game: title,
        name: name,
        desc: desc,
        files: fields,
        avatar: avatar.filename,
        copyright: copyright,
        author: user.id,
        smallAvatar,
        tags,
      },
    ]);
    await this.manageCounts(title);
    await this.logs.log('add-post', user.username, user.username);
    return {};
  }

  async manageCounts(title: string) {
    let counts = await this.post.find({ game: title }).countDocuments();
    await this.game.findOneAndUpdate(
      {
        _id: title,
      },
      { $set: { count: counts } },
    );
  }

  async download(downloadDto: DownloadDto) {
    let foundGame = await this.game.findOne({
      name: downloadDto.name,
    });
    if (!foundGame) throw new NotFoundException();

    let foundPost = await this.post
      .findOne({ game: foundGame.id })
      .skip(downloadDto.index);
    if (!foundPost) throw new NotFoundException();

    foundPost.downloads += 1;
    await foundPost.save();
    
    return {};  
  }

  async downloadById(downloadByID: DownloadByIdDto) {
    let foundPost = await this.post.findOne({ _id: downloadByID.id });
    if (!foundPost) throw new NotFoundException();

    foundPost.downloads += 1;
    await foundPost.save();

    return {};
  }

  async rate(rateDto: RateDto) {
    let foundGame = await this.game.findOne({
      name: rateDto.name,
    });
    if (!foundGame) throw new NotFoundException();

    let foundPost = await this.post
      .findOne({ game: foundGame.id })
      .skip(rateDto.index);
    if (!foundPost) throw new NotFoundException();

    foundPost.rates[rateDto.rate] += 1;

    foundPost.rating =
      (foundPost.rates[1] * 1 +
        foundPost.rates[2] * 2 +
        foundPost.rates[3] * 3 +
        foundPost.rates[4] * 4 +
        foundPost.rates[5] * 5) /
      (foundPost.rates[1] +
        foundPost.rates[2] +
        foundPost.rates[3] +
        foundPost.rates[4] +
        foundPost.rates[5]);
    await foundPost.save();
    return {};
  }

  async rateById(rateDtoById: RateByIdDto) {
    let foundPost = await this.post.findOne({ _id: rateDtoById.id });
    if (!foundPost) throw new NotFoundException();

    foundPost.rates[rateDtoById.rate] += 1;

    foundPost.rating =
      (foundPost.rates[1] * 1 +
        foundPost.rates[2] * 2 +
        foundPost.rates[3] * 3 +
        foundPost.rates[4] * 4 +
        foundPost.rates[5] * 5) /
      (foundPost.rates[1] +
        foundPost.rates[2] +
        foundPost.rates[3] +
        foundPost.rates[4] +
        foundPost.rates[5]);
    await foundPost.save();
    return {};
  }

  async getCount(name: string) {
    if (!name) throw new BadRequestException();

    let foundGame = await this.game.findOne({ name });
    if (!foundGame) throw new BadRequestException();

    let count = await this.post
      .find({
        game: foundGame.id,
      })
      .countDocuments();
    return { count };
  }

  async searchForAdminDto(username: string) {
    let users = await this.user.findOne({ username }, { _id: true });

    return await this.post.find({ author: users._id }).sort({ updatedAt: -1 });
  }

  async remove(id: string ,username : string) {
    try {
      await this.post.findOneAndRemove({ _id: id });
      await this.logs.log('remove-post' , username , username);
      return {};
    } catch(error){
      await this.logs.log('remove-post failed', username , username);
      throw new BadRequestException();
    }
  }
}
