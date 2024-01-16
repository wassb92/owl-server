import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HeartRateDto } from './dto/heart-rate.dto';
import { ApiResponse } from '@/common/dto/reponse.dto';
import { userSchema } from '@/user/model/user.schema';

@Injectable()
export class HeartRateService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<typeof userSchema>,
  ) {}

  async getHeartRate(email: string): Promise<ApiResponse> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return {
          message: 'No user found',
        };
      }
      return {
        message: 'Heart rate found',
        data: user['heartRate'],
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

  async postHeartRate(email: string, data: HeartRateDto): Promise<ApiResponse> {
    const { heartRate } = data;
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return {
          message: 'No user found',
        };
      }
      user['heartRate'].push(heartRate);
      await user.save();
      return {
        message: 'Heart rate added',
        data: user['heartRate'],
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
}
