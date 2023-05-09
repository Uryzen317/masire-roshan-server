import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Replie extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  replieTo: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: string;

  @Prop({ required: true, minlength: 1 })
  replie: string;

  @Prop({ type: Array, default: [] })
  likesList: string[];

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: Array, default: [] })
  dislikesList: string[];

  @Prop({ default: 0 })
  dislikes: number;

  @Prop({ default: 0 })
  replies: number;
}

export const ReplieSchema = SchemaFactory.createForClass(Replie);
