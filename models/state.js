import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema({
  stateName: { type: String, required: true },
  countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
});

export default mongoose.models.State || mongoose.model('State', stateSchema);
