import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Req,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ChangeProfile, ChangeEmail } from '../auth/dto/auth.dto';
import { LoggerService } from '../common/logger/logger.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../common/guard/auth.guard';
import { MailService } from '@/common/mail/mail.service';
import { registerTemplate } from '@/common/mail/template/register';
import { ApiResponse } from '@/common/dto/reponse.dto';
import { JwtService } from '@nestjs/jwt';
import { getUser } from '@/user/dto/user.dto';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  @Get('account')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  account(@Req() req: any) {
    this.logger.log('Getting account...', 'GET' + ' /account');
    return this.usersService.findOne(req.user._id);
  }

  @Put('account')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  async updateAccount(@Req() req: any, @Body() newAccount: ChangeProfile) {
    const user = req['user'];
    this.logger.log('Updating account...', 'PUT' + ' /account ' + user.email);
    return this.usersService.update(req.user._id, newAccount);
  }

  @Put('account/email')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  async updateEmail(
    @Body() updateEmailRequest: ChangeEmail,
    @Req() req: any,
  ): Promise<ApiResponse> {
    const { newEmail } = updateEmailRequest;

    this.logger.log('Updating email...', 'PUT' + ' /account/email');

    const userWithEmailExists = await this.usersService.findByEmail(newEmail);
    if (userWithEmailExists) {
      throw new BadRequestException('Email already exists');
    }

    const fakeConfirmTokenUrl = `http://localhost:5000/api/user/updateEmail/${await this.jwtService.signAsync(
      {
        _id: req.user._id,
        email: newEmail,
      },
    )}`;
    try {
      await this.mailService.sendMail({
        to: newEmail,
        subject: 'Email Change Confirmation ✔',
        html: registerTemplate(fakeConfirmTokenUrl),
      });
      return {
        message: 'Confirmation email sent',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to send confirmation email',
      );
    }
  }

  // Sur la page de confirmation du changement d'e-mail (par exemple, via un formulaire POST)
  @Get('updateEmail/:token')
  async confirmEmailChange(@Param('token') token: string) {
    // Valider le token et procéder à la mise à jour de l'e-mail
    const decodedToken = await this.jwtService.verifyAsync(token);
    if (!decodedToken || !decodedToken._id || !decodedToken.email) {
      throw new BadRequestException('Invalid token');
    }

    // Vérifier l'identité de l'utilisateur et mettre à jour l'e-mail
    const { _id, email } = decodedToken;
    return await this.usersService.updateEmail(_id, email);
    // Autres logiques de confirmation ou de redirection après la mise à jour
  }
}
