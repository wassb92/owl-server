import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerService } from './common/logger/logger.service';
import { AllExceptionsFilter } from './common/exceptions/all-exceptions-filter';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { HeartRateModule } from './heart-rate/heart-rate.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersModule } from './user/users.module';
import { GlobalModule } from './common/global.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { StripeModule } from 'nestjs-stripe';
import { FactureController } from './facture/facture.controller';
import { FactureModule } from './facture/facture.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL, {}),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: '"OWL" <noreply@owl.com>',
      },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    StripeModule.forRoot({
      apiKey: process.env.STRIPE_SECRET_KEY,
    }),
    GlobalModule,
    AuthModule,
    SubscriptionModule,
    HeartRateModule,
    UsersModule,
    FactureModule,
  ],
  controllers: [FactureController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
