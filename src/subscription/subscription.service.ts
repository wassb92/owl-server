import { getUser } from '@/user/dto/user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { userSchema } from '@/user/model/user.schema';
import { CreateSubscriptionDto, PlanType } from './dto/subscription.dto';
import Stripe from 'stripe';
import { ApiResponse } from '@/common/dto/reponse.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectStripe() private readonly stripeClient: Stripe,
    @InjectModel('User') private readonly userModel: Model<typeof userSchema>,
  ) {}

  async createSubscription(
    user: getUser,
    subscriptionDto: CreateSubscriptionDto,
  ): Promise<ApiResponse> {
    const { userId, priceId, mongoUserId } = subscriptionDto;

    // TODO: Get the .currentOffer from the user
    const currentUser = (await this.userModel
      .findById(mongoUserId)
      .lean()
      .exec()) as unknown as { currentOffer: string };

    const hasCurrentOffer = currentUser.currentOffer;

    if (hasCurrentOffer) {
      throw new NotFoundException('Vous avez déjà un abonnement actif.');
    }

    const customer = await this.stripeClient.customers.retrieve(userId);

    // La ligne suivante fonctionne sur le projet Node.js :
    // if (!customer.invoice_settings.default_payment_method) {
    // ChatGPT m'a donner cette ligne en remplacement :
    console.log('customer = ', customer);
    if (
      customer &&
      'invoice_settings' in customer &&
      !customer.invoice_settings.default_payment_method
    ) {
      console.log('invoice_settings');
      const paymentMethod = await this.stripeClient.paymentMethods.create({
        type: 'card',
        card: {
          token: 'tok_visa',
        },
      });
      await this.stripeClient.paymentMethods.attach(paymentMethod.id, {
        customer: userId,
      });
      await this.stripeClient.customers.update(userId, {
        invoice_settings: {
          default_payment_method: paymentMethod.id,
        },
      });
    }

    const subscription = await this.stripeClient.subscriptions.create({
      customer: userId,
      items: [{ price: priceId }],
    });

    await this.userModel.findByIdAndUpdate(mongoUserId, {
      currentOffer: subscription.id,
    });

    return {
      message: 'Abonnement effectué avec succès',
      data: subscription,
    };
  }

  async getSubscription(userNA: getUser): Promise<ApiResponse> {
    const user = (await this.userModel
      .findById(userNA._id)
      .lean()
      .exec()) as unknown as { currentOffer: string };

    if (!user || !user.currentOffer)
      throw new NotFoundException("Vous n'avez pas d'abonnement actif.");

    const subscription = await this.stripeClient.subscriptions.retrieve(
      user.currentOffer,
    );

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return {
      message: 'Subscription found',
      data: subscription,
    };
  }

  async cancelSubscription(userNA: getUser): Promise<ApiResponse> {
    const user = (await this.userModel
      .findById(userNA._id)
      .lean()
      .exec()) as unknown as { currentOffer: string };
    const subscriptionId = user.currentOffer;
    const mongoUserId = userNA._id;

    const subscription = await this.stripeClient.subscriptions.cancel(
      subscriptionId,
    );

    await this.userModel.findByIdAndUpdate(mongoUserId, {
      currentOffer: null,
    });

    return {
      message: 'Abonnement annulé avec succès',
      data: subscription,
    };
  }
}
