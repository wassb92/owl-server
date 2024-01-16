import { MailerService } from '@nestjs-modules/mailer';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { emailSchema } from './model/email.schema';

interface SendMailDto {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private readonly delayInMinutes = 5;
  private readonly maxEmailsPerDelay = 15;

  constructor(
    private readonly mailerService: MailerService,
    @InjectModel('Email')
    private readonly emailModel: Model<typeof emailSchema>,
  ) {}

  async sendMail({
    to,
    subject,
    html,
  }: SendMailDto): Promise<void> {
    try {
      let emailData = await this.emailModel.findOne({ recipient: to });

      if (!emailData) {
        emailData = await this.emailModel.create({
          recipient: to,
          lastSentTime: new Date(),
          sentCount: 1,
        });
      } else {
        const currentTime = new Date();
        const delayInMilliseconds = this.delayInMinutes * 60 * 1000;

        if (
          currentTime.getTime() - emailData['lastSentTime'].getTime() >=
          delayInMilliseconds
        ) {
          emailData['sentCount'] = 0;
          emailData['lastSentTime'] = currentTime;
        }

        if (emailData['sentCount'] >= this.maxEmailsPerDelay) {
          throw new ForbiddenException(
            `You can only send ${this.maxEmailsPerDelay} emails every ${this.delayInMinutes} minutes`,
          );
        }
        emailData['sentCount'] += 1;
        await emailData.save();
      }

      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
