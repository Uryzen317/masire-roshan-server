import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { GamesModule } from "./games/games.module";
import { ConfigModule } from "@nestjs/config";
import { BioModule } from "./bio/bio.module";
import { CdnModule } from "./cdn/cdn.module";
const dotenv = require("dotenv").config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    UsersModule,
    MongooseModule.forRoot(
      // `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_DOMAIN}:${process.env.DB_PORT}/${process.env.DB_COLLECTION}`
      `mongodb://127.0.0.1:27017/masire_almaidah`
    ),
    GamesModule,
    BioModule,
    CdnModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
