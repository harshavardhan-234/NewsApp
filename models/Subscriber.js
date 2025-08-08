// models/subscriber.js
import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  plan: String,
  paymentId: String,
  createdAt: Date,
  premium: Boolean,
});

export default mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
