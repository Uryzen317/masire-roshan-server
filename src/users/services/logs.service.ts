import { Injectable } from '@nestjs/common';
import { UserLog } from 'src/users/models/userlog.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LogsService {
  constructor(@InjectModel(UserLog.name) public userlog: Model<UserLog>) {}

  async log(operation: string, username: string, email: string): Promise<void> {
    await this.userlog.insertMany([
      {
        operation,
        username,
        email,
      },
    ]);
  }

  async list(){
    return await this.userlog.find({}).sort({'createdAt' : -1}).limit(1000)
  }

  async search(username : string){
    return await this.userlog.find({
      $or : [{username} , {email : username}]
    }).lean()
  }
}
