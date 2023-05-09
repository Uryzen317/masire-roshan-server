import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document } from 'mongoose';

@Schema()
export class Bio extends Document{
  @Prop({ref: 'User', type: MongooseSchema.Types.ObjectId})
  author: MongooseSchema.Types.ObjectId;
  
  @Prop({ required: true})
  bio: string;
  
  @Prop({ default: [] })
  goals: string[];
  
  @Prop({ default: [] })
  achievements: string[];
  
  @Prop({ default: [] })
  skills: string[];
  
  @Prop({ default: [] })
  callInfo: string[];
  
  @Prop({ default: '000'})
  background: string;
}

export const BioSchema = SchemaFactory.createForClass(Bio);
