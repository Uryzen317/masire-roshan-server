import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from 'src/users/models/user.model';
import { Game } from './game.model';

interface Rates {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

@Schema({ timestamps: true })
export class Post {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Game',
    required: true,
  })
  game: Game;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  author: User;
  
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  smallAvatar: string;

  @Prop({ required: true })
  desc: string;

  @Prop({ default: 'public' })
  copyright: string;

  @Prop({ default: 5, min: 0, max: 5 })
  rating: number;

  @Prop({
    required: true,
    type: {},
    default: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  })
  rates: Rates;

  @Prop({ default: 0, min: 0 })
  downloads: number;

  @Prop({ default: 0, min: 0 })
  comments: number;

  @Prop()
  files: [
    {
      path: string;
      title: string;
      type: string;
    },
  ];
  
  @Prop({required : false, default : []})
  tags: []
}

export type PostDocument = Document & Post;
export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ name: 'text' });
