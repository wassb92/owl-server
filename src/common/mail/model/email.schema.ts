import { Schema } from 'mongoose';

export const emailSchema = new Schema({
  recipient: { type: String, required: true, unique: true },
  lastSentTime: { type: Date, required: true, default: Date.now() },
  sentCount: { type: Number, required: true, default: 0 },
});
