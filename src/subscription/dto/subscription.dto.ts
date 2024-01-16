import { IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  userId: string; // user.stripeCustomerId

  @IsString()
  priceId: string; // price_1OW7rXAT7dZulOGUw34WmBUA or price_1OW7tRAT7dZulOGUt8efeEdX

  @IsString()
  mongoUserId: string;
}

export const PlanType = {
  premium: {
    price: {
      monthly: 9.9, // price_1OW7rXAT7dZulOGUw34WmBUA
      yearly: 99, // price_1OW7tRAT7dZulOGUt8efeEdX
    },
  },
};
