import { Module } from '@nestjs/common';
import { BioController } from './controllers/bio.controller';
import { BioService } from './services/bio.service';
import { Bio, BioSchema } from './models/bio.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { GamesModule } from '../games/games.module';

@Module({
  controllers: [BioController],
  providers: [BioService],
  imports:[
    MongooseModule.forFeature([
      { name: Bio.name, schema: BioSchema }
    ]),
    UsersModule,
    GamesModule,
  ]
})
export class BioModule {}
