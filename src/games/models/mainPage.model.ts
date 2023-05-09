import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Game } from './game.model';

@Schema()
export class MainPage extends Document {
  @Prop({ required: true, unique: true })
  index: number;

  @Prop({
    required: true,
    type: {},
  })
  game: {
    name: string;
    avatar: string;
  };

  @Prop({ required: true })
  primaryColor: string;

  @Prop({ required: true })
  secondaryColor: string;

  @Prop({ required: true, type: Array })
  items: {
    avatar: string;
    game: string;
    index: string;
  }[];
  
  @Prop({ default: 0})
  type: number;
}

export const MainPageSchema = SchemaFactory.createForClass(MainPage);
