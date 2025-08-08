import mongoose from 'mongoose';

const CountrySchema = new mongoose.Schema({
  countryName: { type: String, required: true }
});

export default mongoose.models.Country || mongoose.model('Country', CountrySchema);
