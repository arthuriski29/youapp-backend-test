import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/common/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Profiles {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  name: string;

  @Prop({})
  birthday: Date;

  @Prop({})
  zodiac: string;

  @Prop({})
  horoscope: string;

  @Prop()
  height: number;

  @Prop()
  weight: number;
}

export const ProfilesSchema = SchemaFactory.createForClass(Profiles);
