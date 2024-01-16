import { Module } from '@nestjs/common';
import { HeartRateService } from './heart-rate.service';
import { HeartRateController } from './heart-rate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from '@/user/model/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
  controllers: [HeartRateController],
  providers: [HeartRateService],
})
export class HeartRateModule {}
