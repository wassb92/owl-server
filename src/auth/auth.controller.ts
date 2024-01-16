import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Put,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginDto, RegisterDto } from './dto/auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@/common/logger/logger.service';
import { ApiResponse } from '@/common/dto/reponse.dto';
import { AuthGuard } from '@/common/guard/auth.guard';
import { getUser } from '@/user/dto/user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse> {
    this.logger.log('Login account...', 'POST' + ' /login');
    return this.authService.login(loginDto);
  }

  @Post('register')
  async createAccount(@Body() registerDto: RegisterDto): Promise<ApiResponse> {
    this.logger.log('Creating account...', 'POST' + ' /register');
    return this.authService.register(registerDto);
  }

  @Put('change-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  async changePassword(
    @Req() req: getUser,
    @Body() password: ChangePasswordDto,
  ): Promise<ApiResponse> {
    const user = req['user'];
    this.logger.log(
      'Changing password...',
      'PUT' + ' /change-password ' + user.email,
    );
    return this.authService.changePassword(user, password);
  }

  @Get('confirm/:token')
  async confirmEmail(
    @Param('token') token: string,
  ): Promise<ApiResponse> {
    this.logger.log('Confirming email...', 'GET' + ' /confirm ');
    return this.authService.confirmEmail(token);
  }
}
