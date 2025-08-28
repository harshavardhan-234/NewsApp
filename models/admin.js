import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Avoid model overwrite issue in Next.js hot reload
export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
