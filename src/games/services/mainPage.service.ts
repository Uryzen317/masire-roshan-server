import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogsService } from 'src/users/services/logs.service';
import { EditMainPageDto } from '../dtos/mainPage.dto';
import { Game } from '../models/game.model';
import { MainPage } from '../models/mainPage.model';
import { Post } from '../models/post.model';

@Injectable()
export class MainPageService {
  constructor(
    @InjectModel(MainPage.name) public mainPage: Model<MainPage>,
    @InjectModel(Game.name) public games: Model<Game>,
    @InjectModel(Post.name) public posts: Model<Post>,
    public logs: LogsService,
  ) {}

  async edit(editMainPageDto: EditMainPageDto, username: string) {
    let { index, title, primaryColor, secondaryColor, type } = editMainPageDto;

    if(!editMainPageDto.primaryColor || !editMainPageDto.secondaryColor || !editMainPageDto.title){
      this.logs.log("edit-mainPage failed", username, username);
      throw new BadRequestException();
    }

    let foundGame = await this.games.findOne({ _id: title });
    let items: any = await this.posts
      .find({ game: foundGame.id })
      .sort({
        downloads: -1,
      })
      .limit(10);
    items = items.map((item) => {
      return {
        name: foundGame.name,
        avatar: item.smallAvatar,
        index: item._id,
        title: item.name,
      };
    });

    let editedMainPage = await this.mainPage.findOne({ index });
    if (!editedMainPage) {
      await this.mainPage.insertMany([
        {
          index,
          game: { name: foundGame.name, avatar: foundGame.avatar },
          primaryColor,
          secondaryColor,
          items,
          type,
        },
      ]);
    } else {
      editedMainPage.game = { name: foundGame.name, avatar: foundGame.avatar };
      editedMainPage.primaryColor = primaryColor;
      editedMainPage.secondaryColor = secondaryColor;
      editedMainPage.items = items;
      editedMainPage.type = type;

      await editedMainPage.save();
    }

    await this.logs.log('edit-mainPage', username, username);
    return {};
  }

  async list() {
    return await this.mainPage.find({}, { _id: false }).sort({ index : 1 }).lean();
  }
}
