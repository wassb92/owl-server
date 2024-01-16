import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { userSchema } from '@/user/model/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto, LoginDto, RegisterDto } from './dto/auth.dto';
import { ApiResponse } from '@/common/dto/reponse.dto';
import { MailService } from '@/common/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { getUser } from '@/user/dto/user.dto';
import Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<typeof userSchema>,
    @InjectStripe() private readonly stripeClient: Stripe,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login(loginDto: LoginDto): Promise<ApiResponse> {
    let user = null;
    try {
      user = await this.userModel.findOne({ email: loginDto.email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isMatch = await bcrypt.compare(loginDto.password, user['password']);
      if (!isMatch) {
        throw new ForbiddenException('Wrong password');
      }
    } catch (error) {
      throw error;
    }
    return {
      data: {
        token: await this.jwtService.signAsync({
          _id: user._id,
          email: user.email,
        }),
      },
      message: 'Login success',
    };
  }

  async register(createUserInput: RegisterDto): Promise<ApiResponse> {
    try {
      const user = await this.userModel.findOne({
        email: createUserInput.email,
      });
      if (user) {
        throw new ForbiddenException('User already exists');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserInput.password, salt);
      const customer = await this.stripeClient.customers.create({
        email: createUserInput.email,
      });
      const newUser = new this.userModel({
        ...createUserInput,
        password: hashedPassword,
        stripeCustomerId: customer.id,
        currentOffer: null,
      });

      await newUser.save();

      await this.mailService.sendMail({
        to: newUser['email'],
        subject: 'Confirm your email',
        html: `
          <p>Hi ${newUser['firstName']} ${newUser['lastName']},</p>
          <p>Please click <a href="http://localhost:5000/api/auth/confirm/${await this.jwtService.signAsync(
            {
              _id: newUser._id,
              email: newUser['email'],
            },
          )}">here</a> to confirm your email</p>
        `,
      });

      return {
        message: 'User created, please check your email to confirm',
        data: {
          token: await this.jwtService.signAsync({
            _id: newUser._id,
            email: newUser['email'],
          }),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async changePassword(
    { _id }: getUser,
    { password }: ChangePasswordDto,
  ): Promise<ApiResponse> {
    try {
      let user = await this.userModel.findOne({ _id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user['password'] = hashedPassword;
      await user.save();
      return {
        message: 'Password changed',
      };
    } catch (error) {
      throw error;
    }
  }

  async confirmEmail(token: string): Promise<ApiResponse> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);

      let user = await this.userModel.findOne({ _id: decoded._id });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user['expireAt'] = null;
      await user.save();
      return {
        message: 'Email confirmed',
      };
    } catch (error) {
      throw error;
    }
  }
}
