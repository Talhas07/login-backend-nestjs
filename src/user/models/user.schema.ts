import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Users extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
}
export const userSchema = SchemaFactory.createForClass(Users);
