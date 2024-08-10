import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { UserSchema } from 'src/common/schemas/user.schema';
import { ProfilesSchema } from 'src/common/schemas/profile.schema';
import { InterestSchema } from 'src/common/schemas/interest.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessageSchema } from 'src/common/schemas/chat.message.schema';

@Module({
  imports: [
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       secret: config.get<string>('JWT_SECRET'),
    //       signOptions: {
    //         expiresIn: config.get<string | number>('JWT_EXPIRES'),
    //       },
    //     };
    //   },
    // }),
    PassportModule,
    JwtModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Profiles', schema: ProfilesSchema }]),
    MongooseModule.forFeature([{ name: 'Interests', schema: InterestSchema }]),
    // MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, JwtStrategy],
  exports: [PassportModule],
})
export class ProfileModule {}
