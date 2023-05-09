import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Tag extends Document {
  @Prop({ required: true })
  name: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
TagSchema.index({ name: 'text' });
