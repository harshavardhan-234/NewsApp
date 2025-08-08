// models/PremiumUser.js
import mongoose from 'mongoose';

const premiumUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  plan: Number,
  expiresAt: Date,
}, { timestamps: true });

export default mongoose.models.PremiumUser || mongoose.model('PremiumUser', premiumUserSchema);

