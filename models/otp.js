import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Expires in 5 minutes
});

export default mongoose.models.Otp || mongoose.model('Otp', otpSchema);
