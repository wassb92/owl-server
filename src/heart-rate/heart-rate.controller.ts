import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { HeartRateService } from './heart-rate.service';
import { AuthGuard } from '@/common/guard/auth.guard';
import { LoggerService } from '@/common/logger/logger.service';
import { HeartRateDto } from './dto/heart-rate.dto';

@ApiTags('heart-rate')
@Controller('heart-rate')
export class HeartRateController {
  constructor(
    private readonly heartRateService: HeartRateService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  getHeartRate(@Req() req: any) {
    this.logger.log('GetHeartRate...', 'GET' + ' /heart-rate');
    return this.heartRateService.getHeartRate(req.user.email);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  postHeartRate(@Req() req: any, @Body() data: HeartRateDto) {
    this.logger.log('PostHeartRate...', 'POST' + ' /heart-rate');
    return this.heartRateService.postHeartRate(req.user.email, data);
  }
}
