import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CustomRequest } from 'src/common/interface/custom-request.interface';
import { JwtAuthGuard } from 'src/common/guard/jwt.guards';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/getProfile/')
  async getProfile(@Req() req: CustomRequest): Promise<any> {
    const { id } = req.user;
    return await this.profileService.getProfile(id);
  }

  @Post('/createProfile')
  async createProfile(
    @Req() req: CustomRequest,
    @Body() createProfileDto: CreateProfileDto,
  ): Promise<any> {
    const { id } = req.user;
    const profile = await this.profileService.createProfile(
      id,
      createProfileDto,
    );
    const interest = await this.profileService.updateInterest(
      id,
      createProfileDto.interest,
    );
    const result = {
      name: profile.name,
      birthday: profile.birthday,
      zodiac: profile.zodiac,
      horoscope: profile.horoscope,
      height: profile.height,
      weight: profile.weight,
      interests: interest.interests,
    };
    return result;
  }

  @Put('/updateProfile')
  async updateProfile(
    @Req() req: CustomRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<any> {
    const { id } = req.user;
    const profile = await this.profileService.updateProfile(
      id,
      updateProfileDto,
    );
    const interest = await this.profileService.updateInterest(
      id,
      updateProfileDto.interest,
    );
    const result = {
      name: profile.name,
      birthday: profile.birthday,
      zodiac: profile.zodiac,
      horoscope: profile.horoscope,
      height: profile.height,
      weight: profile.weight,
      interests: interest.interests,
    };
    return result;
  }
}
