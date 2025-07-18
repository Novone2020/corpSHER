import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import shortid from 'shortid';
import dotenv from 'dotenv';
import Video from './models/Video.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Connect to MongoDB and only start the server if successful
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit the app if DB connection fails
  });

app.post('/api/videos', async (req, res) => {
  const { url, videoId } = req.body;
  try {
    const video = new Video({ url, videoId });
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: 'Could not save video' });
  }
});

app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ addedAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

app.delete('/api/videos/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

app.get('/v/:code', async (req, res) => {
  const video = await Video.findOne({ shortcode: req.params.code });
  if (video) {
    res.redirect(`https://www.youtube.com/watch?v=${video.videoId}`);
  } else {
    res.status(404).send('Video not found');
  }
});
