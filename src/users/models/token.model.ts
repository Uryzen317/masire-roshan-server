import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps : true })
export class Token extends Document {
  @Prop({required : true})
  operation : string;

  @Prop()
  data : string;

  @Prop({default : false})
  isExpired : boolean;

  @Prop()
  token : string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
