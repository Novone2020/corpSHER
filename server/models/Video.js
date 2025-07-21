import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  url: String,
  videoId: String,
  code: String,
  shortcode: String,
  addedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Video', videoSchema);
