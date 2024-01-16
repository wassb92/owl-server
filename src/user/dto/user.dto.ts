import { userSchema } from '@/user/model/user.schema';
import { PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Model } from 'mongoose';

export class CreateUserDto extends PickType(Model<typeof userSchema>, [
  'email',
  'password',
] as const) {}

export class getUser {
  @IsString()
  _id: string;
  @IsString()
  email: string;
  @IsString()
  currentOffer: string;
}

export class UpdateUserDto {
  readonly username?: string;
  readonly email?: string;
  readonly age?: number;
}
