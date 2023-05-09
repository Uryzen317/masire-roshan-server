import { 
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../users/models/user.model';
import { Bio } from '../models/bio.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogsService } from '../../users/services/logs.service';
import { Post } from '../../games/models/post.model';

@Injectable()
export class BioService {
  constructor(
    @InjectModel(User.name) public users: Model<User>,
    @InjectModel(Bio.name) public bio: Model<Bio>,
    @InjectModel(Post.name) public posts: Model<Post>,
    public logs: LogsService,
  ){}
  
  async set(setDto, user){
    let { bio, background, skills, achievements, goals, callInfo } = setDto,
        { id, username } = user;
        
    // validation
    if(!Array.isArray(skills) || !Array.isArray(achievements) || !Array.isArray(goals) || !Array.isArray(callInfo)){
      this.logs.log('set-bio failed', username, username);
      throw new BadRequestException();
    }
    if(!bio){
      this.logs.log('set-bio failed', username, username);
      throw new BadRequestException('متنی برای توضیحات وارد کنید');
    }
    
    if(await this.bio.findOne({ author: id })){
      await this.bio.findOneAndUpdate({ author: id }, {
        $set: {
          author: id,
          skills,
          achievements,
          bio,
          background,
          callInfo,
          goals,
       }
      })
      await this.logs.log('set-bio', username, username); 
      return {};
    }
    
    let newBio = new this.bio({
      author: id,
      skills,
      achievements,
      bio,
      background,
      callInfo,
      goals,
    })
    await newBio.save();
    await this.logs.log('set-bio', username, username);
    return await {};
  }
  
  async get(id: string){
    let bio: any ;
    // validation
    if(!id) throw new NotFoundException();
    
    try{
      bio = await this.bio.findOne({ author: id }).
                  populate({ path: 'author', 
                            select: [
                                'username', 
                                'firstname', 
                                'createdAt',
                                'role',
                                'avatar',
                                'isGoogleAvatar',
                            ] 
                          }).
                  lean();
                  
      // again validation
    }catch(err){
      if(!bio) throw new NotFoundException();
    }
    if(!bio) throw new NotFoundException();
    
    bio.posts = await this.posts.countDocuments({ author: id });            
    
    return bio;
  }
}
