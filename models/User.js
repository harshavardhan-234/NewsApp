import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  plan: Number,
  startDate: { type: Date, default: Date.now },
  expiryDate: Date,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
