import { Schema } from 'mongoose';

export const subscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  paymentId: { type: String, required: false },
  paymentType: {
    type: String,
    required: false,
    enum: ['stripe', 'paypal'],
    default: 'stripe',
  },
  pricePlan: {
    type: String,
    required: true,
    enum: ['free', 'premium'],
    default: 'free',
  },
  expiryDate: { type: Date, required: false, default: null },
});
