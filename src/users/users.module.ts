import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthenticationService } from './services/authentication.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { UserLog, UserLogSchema } from './models/userlog.model';
import { LogsService } from './services/logs.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './services/jwt.strategy';
import { UsersService } from './services/users.service';
import { AdminGuard } from './guards/admin.guard';
import { ConfigService } from '@nestjs/config';
// import { avatarGuard } from './guards/avatar.guard';
import { GoogleStrategy } from "./services/google.strategy";
import { Token, TokenSchema } from "./models/token.model";
import { MailService } from "./services/mails.service";

@Module({
  providers: [
    AuthenticationService,
    LogsService,
    // JwtStrategy,
    UsersService,
    AdminGuard,
    // avatarGuard,
    GoogleStrategy,
    MailService
  ],
  controllers: [UsersController],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      verifyOptions: {
        maxAge: '7d',
      },
      // privateKey : process.env.JWT_SECRET
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      { name: UserLog.name, schema: UserLogSchema },
      { name: Token.name, schema: TokenSchema }
    ]),
  ],
  exports: [LogsService, JwtModule, MongooseModule],
})
export class UsersModule {
  //   configure(consumer: MiddlewareConsumer) {
  //     consumer.apply(UploadsMiddleware).forRoutes(UsersController);
  //   }
}
