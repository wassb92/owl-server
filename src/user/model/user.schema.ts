import { Schema } from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');

export const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthDate: { type: Date, required: true },
    gender: { type: String, required: true, enum: ['men', 'women'] },
    password: { type: String, required: true },
    height: { type: Number, required: false },
    weight: { type: Number, required: false },
    google: {
      refreshToken: { type: String, required: false },
    },
    heartRate: [{ type: Number, required: false }],
    oxygenSupply: [{ type: Number, required: false }],
    sleepingTime: [{ type: Number, required: false }],
    stripeCustomerId: { type: String, required: false, default: null },
    currentOffer: { type: String, required: false, default: null },

    createdAt: { type: Date, default: Date.now },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 15,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(uniqueValidator);
