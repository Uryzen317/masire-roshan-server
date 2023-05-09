import * as nodeMailer from "nodemailer";
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService{
  constructor(public configService : ConfigService){}

  async mail(email: string, subject: string, data: string){
    const transportEmail = nodeMailer.createTransport({
    host: this.configService.get("EMAIL_HOST"),
    port: this.configService.get("EMAIL_PORT"),
    secure: true,
    auth: {
        user: this.configService.get("EMAIL_USERNAME"),
        pass: this.configService.get("EMAIL_PASSWORD"),
    }
    });
    const sendEmail = await transportEmail.sendMail({
        from: this.configService.get("EMAIL_USERNAME"),
        to: email,
        subject: subject,
        text: data,
    });
  }
}
