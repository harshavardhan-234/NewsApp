// models/News.js
import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: String,
  description: String,
  slug: { type: String, unique: true },
  image: String,
  category: String,
}, { timestamps: true });

export default mongoose.models.News || mongoose.model('News', NewsSchema);
