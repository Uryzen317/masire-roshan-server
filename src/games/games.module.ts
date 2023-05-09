import { v4 } from 'uuid';

import { Module, BadRequestException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UsersModule } from 'src/users/users.module';
import { GamesController } from './controllers/games.controller';
import { MainPageController } from './controllers/mainPage.controller';
import { CommentsController } from './controllers/comments.controller';
import { PostsController } from './controllers/posts.controller';
import { TagsController } from './controllers/tags.controller';
import { Game, GameSchema } from './models/game.model';
import { MainPageSchema, MainPage } from './models/mainPage.model';
import { PostSchema, Post } from './models/post.model';
import { Tag, TagSchema } from './models/tags.model';
import { GamesService } from './services/games.service';
import { MainPageService } from './services/mainPage.service';
import { PostsService } from './services/posts.service';
import { TagsService } from './services/tags.service';
import { extname } from 'path';
import { CommentsService } from './services/comments.service';
import { Comment, CommentSchema } from './models/comment.model';
import { Replie, ReplieSchema } from './models/replie.model';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: Post.name, schema: PostSchema },
      { name: Tag.name, schema: TagSchema },
      { name: MainPage.name, schema: MainPageSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Replie.name, schema: ReplieSchema },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './cdn',
        filename(req, file, callback) {
          let fileExt = extname(file.originalname);
          callback(null, v4() + fileExt); 
        },
      }),
      // fileFilter(req, file, callback) {
      //   file.fieldname = 'sdfsadf';
      //   callback(null, true);
      // },
    }),
  ],
  exports: [
    MongooseModule,
  ],
  controllers: [
    GamesController,
    PostsController,
    TagsController,
    MainPageController,
    CommentsController
  ],
  providers: [
    GamesService,
    PostsService,
    TagsService,
    MainPageService,
    CommentsService,
  ],
})
export class GamesModule {}
