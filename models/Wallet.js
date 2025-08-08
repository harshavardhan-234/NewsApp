import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

export default mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema);
