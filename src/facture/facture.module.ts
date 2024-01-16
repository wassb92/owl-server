import { Module } from '@nestjs/common';
import { FactureService } from './facture.service';

@Module({
  providers: [FactureService]
})
export class FactureModule {}
