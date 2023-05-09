import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogsService } from 'src/users/services/logs.service';
import { Tag } from '../models/tags.model';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) public tags: Model<Tag>,
    public logs: LogsService,
  ) {}

  async search(search: any) {
    return await this.tags
      .find({ $text: { $search: search } })
      .sort({ $score: { $meta: 'textScore' } });
  }

  async add(title: string, username: string) {
    if (!title) throw new BadRequestException();

    // check uniquness
    let tag = await this.tags.findOne({
      name: title,
    });
    if (tag) {
      this.logs.log('add-tag failed', username, username);
      throw new BadRequestException();
    }
    await this.tags.insertMany([
      {
        name: title,
      },
    ]);
    await this.logs.log('add-tag', username, username);
    return {};
  }

  async edit(title: string, newTitle: string, username: string) {
    let tag = await this.tags.findOneAndUpdate(
      {
        name: title,
      },
      {
        $set: {
          name: newTitle,
        },
      },
    );
    if (!tag) {
      this.logs.log('edit-tag failed', username, username);
      throw new BadRequestException();
    }
    await this.logs.log('edit-tag', username, username);
    return {};
  }

  async delete(title: string, username: string) {
    let tag = await this.tags.findOneAndDelete({
      name: title,
    });
    if (!tag) {
      this.logs.log('delete-tag failed', username, username);
      throw new BadRequestException();
    }
    await this.logs.log('delete-tag', username, username);
    return {};
  }
}
