import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { Model } from "mongoose";
import { User } from "../models/user.model";
import { LogsService } from "./logs.service";
import { JwtService } from "@nestjs/jwt";
import { v4 } from 'uuid';
const dotEnv = require("dotenv").config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy){
  constructor(@InjectModel(User.name) public users : Model<User>,
              public logs : LogsService,
              public jwtService : JwtService){
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT,
      scope: ['profile', 'email'],
    })
  }

  async validate(accessToken, refreshToken, profile, cb){
    // gathering data
    let googleId = profile.id;
    let username = profile.displayName;
    let firstname = profile.name.givenName || null;
    let lastname = profile.name.familyName || null;
    let email = profile.emails[0].value || null;
    let isEmailVerified = profile.emails[0].verified || false;
    let avatar = profile.photos[0].value || null;

    let user = await this.users.findOne({
      email
    })
    // has an account
    if(user){
      let accessToken = this.jwtService.sign({id : user._id, username : user.username, avatar: user.avatar, isGoogleAvatar : user.isGoogleAvatar || false});
      await this.logs.log("login-google", username, email);
      await this.users.findOneAndUpdate({_id : user._id, emailConfirmed: false}, {$set: {emailConfirmed: true}});
      cb(null, accessToken);
    }

    // does not have an account
    if(!user){
      let newUser ;
      // create an
      // check if username is unique
      let isUsernameUnique = await this.users.findOne({ username });

      // this username is uniqe
      if(!isUsernameUnique){
        newUser = new this.users({
          username,
          email,
          googleId,
          firstname,
          lastname,
          emailConfirmed : true,
          avatar,
          isGoogleAvatar : true
        })
      }else{
        //username is not unique
        newUser = new this.users({
          username : v4(),
          email,
          googleId,
          firstname,
          lastname,
          emailConfirmed : true,
          avatar,
          isGoogleAvatar : true
        })
      }
      newUser = await newUser.save();
      let accessToken = this.jwtService.sign({id : newUser._id, username, avatar, isGoogleAvatar : true});
      await this.logs.log('signup-google', username, email);
      cb(null, accessToken);
    }
  }
}
