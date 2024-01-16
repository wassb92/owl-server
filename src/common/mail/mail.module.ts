import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { emailSchema } from './model/email.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Email', schema: emailSchema }]),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
