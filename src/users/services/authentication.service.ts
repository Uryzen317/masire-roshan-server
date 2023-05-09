import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from 'src/users/dtos/login.dto';
import { SignupDto } from 'src/users/dtos/signup.dto';
import { User } from 'src/users/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { LogsService } from './logs.service';
import { JwtService } from '@nestjs/jwt';
//log
//generate token
@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) public user: Model<User>,
    public logs: LogsService,
    public jwt: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    let { username, password, rememberme } = loginDto;
    let expireTime = rememberme ? '7d' : '1d';
    let promisifiedScrypt = promisify(scrypt);

    //check for uniquness
    let checkUser = await this.user.findOne({
      $or: [{ username: username }, { email: username }],
    });
    // threse no such an account
    if (!checkUser) {
      await this.logs.log('failed-login', username, username);
      throw new BadRequestException({ message: 'مشخصات معتبری وارد کنید' });
    }
    // theres an account but its made with google
    if(checkUser.googleId){
      await this.logs.log('failed-login', username, username);
      throw new BadRequestException({ message: 'مشخصات معتبری وارد کنید' });
    }

    //the hash stored in db
    let salt = await checkUser.salt;
    let hashCheck = checkUser.password;

    //hash generated based on user inputs
    let hashBuffer: any = await promisifiedScrypt(password, salt, 64);
    let hash = Buffer.from(hashBuffer).toString('hex');

    if (hash !== hashCheck) {
      await this.logs.log('failed-login', username, username);
      throw new BadRequestException({ message: 'مشخصات معتبری وارد کنید' });
    }
    await this.logs.log('login', checkUser.username, checkUser.email);

    let accessToken = this.jwt.sign(
      { id: checkUser.id, username: checkUser.username },
      {
        expiresIn: expireTime,
      },
    );
    return { accessToken };
  }

  async signup(signupDto: SignupDto) {
    let { username, password, email, rememberme } = signupDto;
    let ExpireTime = rememberme ? '7d' : '1d';
    let promisifiedScrypt = promisify(scrypt);

    //check for uniquness
    let checkUser = await this.user.findOne(
      {
        $or: [
          { username: username },
          { email: email },
          { username: email },
          { email: username },
        ],
      },
      { _id: true },
    );

    if (checkUser)
      throw new BadRequestException({
        message: 'نام کاربری یا ایمیل قبلا انتخاب شده است',
      });

    let salt = await randomBytes(16).toString('hex');
    let hashBuffer: any = await promisifiedScrypt(password, salt, 64);
    let hash = Buffer.from(hashBuffer).toString('hex');

    let insertedUser = await this.user.insertMany([
      {
        username,
        email,
        password: hash,
        salt,
      },
    ]);
    if (!insertedUser)
      throw new BadRequestException({ message: 'خطا ، لطفا مجددا تلاش کنید' });
    await this.logs.log('signup', username, email);
    let accessToken = this.jwt.sign(
      { id: insertedUser[0].id, username: insertedUser[0].username },
      { expiresIn: ExpireTime },
    );
    return {
      accessToken,
    };
  }

  async whoAmI(user: any) {
    // await this.user.findOneAndUpdate({_id: user.id}, {$set: {role: 'god'}});
  
    return user;
  }
}
