import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  plan: String,
  country: String,
  state: String,
  city: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
