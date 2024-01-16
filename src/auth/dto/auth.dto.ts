import { userSchema } from '@/user/model/user.schema';
import { PickType } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNumber } from 'class-validator';
import { Model } from 'mongoose';

enum Gender {
  MEN = 'men',
  WOMEN = 'women',
}

export class LoginDto extends PickType(Model<typeof userSchema>, [
  'email' as string,
  'password' as string,
] as const) {
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class RegisterDto extends PickType(Model<typeof userSchema>, [
  'firstName',
  'lastName',
  'email',
  'birthDate',
  'gender',
  'password',
  'height',
  'weight',
] as const) {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  email: string;
  @IsString()
  birthDate: Date;
  @IsString()
  gender: Gender;
  @IsString()
  password: string;
  @IsNumber()
  height: number;
  @IsNumber()
  weight: number;
}

export class ChangePasswordDto {
  @IsString()
  password: string;
}

export class ChangeProfile {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  gender: Gender;
  @IsNumber()
  height: number;
  @IsNumber()
  weight: number;
}

export class ChangeEmail {
  @IsString()
  newEmail: string;
}
