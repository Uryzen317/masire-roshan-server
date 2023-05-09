import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Game {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ default: 0 })
  count: number;

  @Prop({ required: true })
  avatar: string;
}

export type GameDocument = Document & Game;
export const GameSchema = SchemaFactory.createForClass(Game);

GameSchema.index({ name: 'text' });
