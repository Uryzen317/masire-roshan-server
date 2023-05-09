import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserLog {
  @Prop({ required: true, minlength: 5, maxlength: 74 })
  username: string;

  @Prop({ required: true, minlength: 5, maxlength: 74 })
  email: string;

  @Prop({ required: true, default: 'undefined' })
  operation: string;
}

export type UserLogDocument = Document & UserLog;
export const UserLogSchema = SchemaFactory.createForClass(UserLog);
