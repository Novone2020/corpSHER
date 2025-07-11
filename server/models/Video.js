
import mongoose from 'mongoose';
import shortid from 'shortid';

const videoSchema = new mongoose.Schema({
  url: String,
  videoId: String,
  shortcode: {
    type: String,
    default: () => shortid.generate(),
    unique: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('videos', videoSchema);
