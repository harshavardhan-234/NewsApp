import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  siteTitle: String,
  logo: String,
  favicon: String,
  contactEmail: String,
  contactPhone: String,
  footerText: String,
  facebook: String,
  instagram: String,
  linkedin: String,
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
