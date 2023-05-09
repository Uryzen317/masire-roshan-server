import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({required : false})
  googleId : string;

  @Prop({ unique: true, required: true, minlength: 5, maxlength: 74 })
  username: string;

  @Prop({ unique: true, required: true, minlength: 5, maxlength: 74 })
  email: string;

  @Prop({ default: false })
  emailConfirmed: boolean;

  @Prop({ required: false, default: null })
  avatar: string;

  @Prop({required : false})
  isGoogleAvatar : boolean;

  @Prop({ required: false })
  salt: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: false, default: null, minlength: 3, maxlength: 64 })
  firstname: string;

  @Prop({ required: false, default: null, minlength: 3, maxlength: 64 })
  lastname: string;

  @Prop({ required: false })
  number: number;

  @Prop({default : 'user'})
  role : string;
}

export type UserDocument = Document & User;
export const UserSchema = SchemaFactory.createForClass(User);
