import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/subscription.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@/common/logger/logger.service';
import { AuthGuard } from '@/common/guard/auth.guard';
import { getUser } from '@/user/dto/user.dto';
import { ApiResponse } from '@/common/dto/reponse.dto';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly logger: LoggerService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post('createSubscription')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  async createSubscription(
    @Req() req: getUser,
    @Body() subscriptionDto: CreateSubscriptionDto,
  ): Promise<ApiResponse> {
    const user = req['user'];
    this.logger.log(
      'Creating subscription...',
      'POST' + ' /createSubscription ' + user.email,
    );
    return this.subscriptionService.createSubscription(user, subscriptionDto);
  }

  @Delete('cancelSubscription')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  async cancelSubscription(@Req() req: getUser): Promise<ApiResponse> {
    const user = req['user'];
    this.logger.log(
      'Canceling subscription...',
      'DELETE' + ' /cancelSubscription ' + user.email,
    );
    return this.subscriptionService.cancelSubscription(user);
  }

  @Get('getSubscription')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard)
  async getSubscription(@Req() req: getUser): Promise<ApiResponse> {
    const user = req['user'];
    this.logger.log(
      'Getting subscription...',
      'GET' + ' /getSubscription ' + user.email,
    );
    return this.subscriptionService.getSubscription(user);
  }
}
