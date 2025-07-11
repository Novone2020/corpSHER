import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import shortid from 'shortid';
import Video from './models/Video.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://shubziverse:B6sURxAaWYlq3zKe@cluster7.acr3rmn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster7');

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

app.listen(3001, '0.0.0.0', () => {
  console.log('Server is running on port 3001');
});

