import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technology', 'sports', 'politics', 'entertainment', 'business', 'health', 'science'],
    lowercase: true
  },
  duration: {
    type: String,
    trim: true
  },
  views: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
VideoSchema.index({ category: 1, publishedAt: -1 });
VideoSchema.index({ title: 'text', description: 'text' });

export const Video = mongoose.models.Video || mongoose.model('Video', VideoSchema);
