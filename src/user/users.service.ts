import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';
import { userSchema } from './model/user.schema';
import { ApiResponse } from '@/common/dto/reponse.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<typeof userSchema>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<typeof userSchema> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOne(id: string): Promise<typeof userSchema> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<typeof userSchema> {
    const user = await this.userModel.findByIdAndRemove(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: any): Promise<typeof userSchema> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async updateEmail(id: string, newEmail: string): Promise<ApiResponse> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      user['email'] = newEmail;
      await user.save();
      return {
        message: 'Email updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<typeof userSchema | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
