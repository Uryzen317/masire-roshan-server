import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { randomBytes, scrypt as Scrypt } from "crypto";
import { Model } from "mongoose";
import { promisify } from "util";
import {
  ChangeEmailDto,
  ChangeLastnameDto,
  ChangeNumberDto,
  ChangePasswordDto,
  ChangeUsernameDto,
} from "../dtos/change.dto";
import { User } from "../models/user.model";
import { Token } from "../models/token.model";
import { LogsService } from "./logs.service";
import { ConfigService } from "@nestjs/config";
import { MailService } from "./mails.service";
import axios from "axios";
import { v4 } from "uuid";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) public users: Model<User>,
    @InjectModel(Token.name) public tokens: Model<Token>,
    public logsService: LogsService,
    public jwtService: JwtService,
    public configService: ConfigService,
    public mailService: MailService
  ) {}

  async accountDetails(id: number) {
    // await this.users.deleteMany();
    await this.users.findOneAndUpdate({ _id: id }, { $set: { role: "god" } });

    let user: any = await this.users
      .findOne({ _id: id }, { salt: false, password: false })
      .lean();
    let logs = await this.logsService.search(user.username);
    user.logs = logs;

    return user;
  }

  async uploadAavatar(file, accessToken: string) {
    let tokenValidation = this.jwtService.verify(accessToken, {
      ignoreExpiration: false,
    });

    if (!tokenValidation) {
      await this.logsService.log("update-profile failed", "UNKNOWN", "UNKNOWN");
      throw new UnauthorizedException();
    }

    let { username } = tokenValidation;

    let user = await this.users.findOneAndUpdate(
      {
        username,
      },
      {
        $set: {
          avatar: file.filename,
          isGoogleAvatar: false,
        },
      }
    );

    if (!user) {
      await this.logsService.log("update-profile failed", username, username);
      throw new UnauthorizedException();
    }

    await this.logsService.log("update-profile", user.username, user.email);

    return { avatar: file.fileName };
  }

  async changeUsername(
    changeUsernameDto: ChangeUsernameDto,
    id: number,
    username: string
  ) {
    let newUsername = changeUsernameDto.value;

    let checkUniquness = await this.users.findOne({
      $or: [{ username: newUsername }, { email: newUsername }],
    });

    if (checkUniquness) {
      await this.logsService.log("change-username failed", username, username);
      throw new BadRequestException({ message: "این شناسه قابل انتخاب نیست" });
    }

    await this.users.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          username: changeUsernameDto.value,
        },
      }
    );

    await this.logsService.log("change-username", username, username);

    return await {};
  }

  async changeEmail(changeEmailDto: ChangeEmailDto, id: number) {
    let { email } = await this.users.findOne({ _id: id });
    let newEmail = changeEmailDto.value;

    let checkUniquness = await this.users.findOne({
      $or: [{ username: newEmail }, { email: newEmail }],
    });

    if (checkUniquness) {
      await this.logsService.log("change-email failed", email, email);
      throw new BadRequestException({ message: "این شناسه قابل انتخاب نیست" });
    }

    await this.users.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          email: changeEmailDto.value,
          emailConfirmed: false,
        },
      }
    );

    await this.logsService.log(
      "change-email",
      changeEmailDto.value,
      changeEmailDto.value
    );

    return await {};
  }

  async changePassword(changePasswordDto: ChangePasswordDto, id: number) {
    let scrypt = promisify(Scrypt);
    let salt = randomBytes(16).toString("hex");
    let hashBuffer: any = await scrypt(changePasswordDto.value, salt, 64);
    let hash = Buffer.from(hashBuffer).toString("hex");

    let user = await this.users.findOneAndUpdate(
      { _id: id },
      {
        $set: { salt, password: hash },
      }
    );

    await this.logsService.log("change-password", user.username, user.email);

    return {};
  }

  async changeFirstname(changeUsernameDto: ChangeUsernameDto, id: number) {
    let firstname = changeUsernameDto.value;
    let user = await this.users.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          firstname,
        },
      }
    );

    await this.logsService.log("change-firstname", user.username, user.email);

    return {};
  }

  async changeLastname(changeLastnameDto: ChangeLastnameDto, id: number) {
    let lastname = changeLastnameDto.value;
    let user = await this.users.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          lastname,
        },
      }
    );

    await this.logsService.log("change-lastname", user.username, user.email);

    return {};
  }

  async changeNumber(changeNumberDto: ChangeNumberDto, id: number) {
    let number = changeNumberDto.value;
    let user = await this.users.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          number,
        },
      }
    );

    await this.logsService.log("chagne-number", user.username, user.email);

    return {};
  }

  async listAdmins() {
    return await this.users.find({ role: "admin" });
  }

  async deAdmin(id: string) {
    return await this.users.findOneAndUpdate(
      { _id: id },
      { $set: { role: "user" } }
    );
  }

  async admin(id: string) {
    return await this.users.findOneAndUpdate(
      { _id: id },
      { $set: { role: "admin" } }
    );
  }

  async ban(id: string) {
    return await this.users.findOneAndRemove({ _id: id });
  }

  async searchAdmins(name: string) {
    return await this.users.find({ username: name });
  }

  async logsList() {
    return await this.logsService.list();
  }

  async checkRecaptcha(token: string) {
    let secret = this.configService.get("RECAPTCHA_SECRET");
    try {
      let validation = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
        {}
      );
      if (!validation.data.success) throw new BadRequestException();
      return {};
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async forgotPassword(email: string) {
    let user = await this.users.findOne({
      email,
      googleId: { $eq: null },
    });
    if (!user) return {};

    // delete any token than already exists with this email
    await this.tokens.updateMany(
      { data: email, operation: "forgot-password", isExpired: true },
      { $set: { isExpired: false } }
    );

    let token = v4() + v4();
    await this.tokens.insertMany([
      {
        operation: "forgot-password",
        data: email,
        token,
      },
    ]);
    await this.mailService.mail(
      email,
      "فراموشی رمز عبور",
      `بر روی لینک زیر کلیک کنید \n ${this.configService.get(
        "CLIENT_ADDRESS"
      )}#/panel/forgotPassword/${token}`
    );
    return {};
  }

  async setForgottonPassword(token: string, password: string) {
    let isValid: any = await this.tokens.findOne({
      token,
      isExpired: false,
      operation: "forgot-password",
    });

    if (!isValid) {
      await this.logsService.log("forgot-password failed", "UNKOWN", "UNKOWN");
      throw new BadRequestException();
    }

    let tokenExpiry: any = (Date.now() - isValid.createdAt) / (1000 * 60);
    if (tokenExpiry > 15) {
      await this.logsService.log(
        "forgot-password failed",
        isValid.email,
        isValid.email
      );
      await this.tokens.updateMany(
        { _id: isValid._id },
        { $set: { isExpired: true } }
      );
      throw new BadRequestException({ message: "این کد منقضی شده است" });
    }

    await this.tokens.findOneAndUpdate(
      { _id: isValid.id },
      { $set: { isExpired: true } }
    );

    let scrypt = promisify(Scrypt);
    let salt = randomBytes(16).toString("hex");
    let hashBuffer: any = await scrypt(password, salt, 64);
    let hash = Buffer.from(hashBuffer).toString("hex");

    let user = await this.users.findOneAndUpdate(
      { email: isValid.data },
      {
        $set: { salt, password: hash },
      }
    );

    await this.logsService.log("forgot-password", user.username, user.email);
    return {};
  }

  async getConfirmEmail(accessToken: string) {
    let user: any;
    try {
      user = this.jwtService.verify(accessToken, { ignoreExpiration: false });
    } catch (error) {
      await this.logsService.log("email-confirm failed", "UNKNOWN", "UNKNOWN");
      throw new BadRequestException();
    }

    user = await this.users.findOne({ _id: user.id });
    // expire any existing token of email confirmation
    await this.tokens.updateMany(
      { operation: "email-confirm", data: user.email, isExpired: false },
      { $set: { isExpired: true } }
    );
    //generate new token
    let token = Math.floor(Math.random() * 99999);
    await this.tokens.insertMany([
      {
        operation: "email-confirm",
        data: user.email,
        token,
      },
    ]);
    await this.mailService.mail(
      user.email,
      "تایید ایمیل",
      `کد تایید ایمیل شما \n ${token}`
    );

    return {};
  }

  async confirmEmail(id: string, key: number) {
    let user = await this.users.findOne({ _id: id });
    // token validation
    let isValid: any = await this.tokens.findOne({
      operation: "email-confirm",
      data: user.email,
      isExpired: false,
    });
    if (!isValid)
      throw new BadRequestException({ message: "خطای اعتبار سنجی" });
    // code is not valid
    if (parseInt(isValid.token) != key) {
      await this.logsService.log(
        "email-confirm failed",
        user.username,
        user.email
      );
      throw new BadRequestException({ message: "کد وارد شده صحیح نیست" });
    }
    // code is valid
    let tokenExpiry: any = (Date.now() - isValid.createdAt) / (1000 * 60);
    if (tokenExpiry > 15) {
      await this.logsService.log(
        "email-confirm failed",
        user.username,
        user.email
      );
      await this.tokens.updateMany(
        { _id: isValid._id },
        { $set: { isExpired: true } }
      );
      throw new BadRequestException({ message: "این کد منقضی شده است" });
    }

    await this.tokens.updateMany(
      { _id: isValid._id },
      { $set: { isExpired: true } }
    );
    await this.users.findOneAndUpdate(
      { _id: id },
      { $set: { emailConfirmed: true } }
    );

    return {};
  }
}
