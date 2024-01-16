import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { AuthGuard } from './guard/auth.guard';

@Global()
@Module({
  providers: [LoggerService, AuthGuard],
  exports: [LoggerService, AuthGuard],
})
export class GlobalModule {}
