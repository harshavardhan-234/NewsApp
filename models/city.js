import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  cityName: { type: String, required: true },
  stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
});

export default mongoose.models.City || mongoose.model('City', citySchema);
