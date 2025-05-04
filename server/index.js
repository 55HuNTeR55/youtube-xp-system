const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/youtube-clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  xp: { type: Number, default: 0 },
  watchHistory: [{
    videoId: String,
    watchTime: Number,
    xpEarned: Number,
    date: { type: Date, default: Date.now }
  }],
  isPremium: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

// Video Schema
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  videoUrl: String,
  channel: String,
  views: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);

// Routes

// Get all videos
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get video by ID
app.get('/api/videos/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user XP
app.post('/api/users/:userId/xp', async (req, res) => {
  try {
    const { watchTime } = req.body;
    const xpEarned = Math.floor(watchTime / 600) * 5; // 5 XP per 10 minutes

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.xp += xpEarned;
    user.watchHistory.push({
      videoId: req.body.videoId,
      watchTime,
      xpEarned
    });

    await user.save();
    res.json({ xpEarned, totalXp: user.xp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Purchase Premium
app.post('/api/users/:userId/premium', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const premiumCost = 50;
    if (user.xp < premiumCost) {
      return res.status(400).json({ message: 'Not enough XP' });
    }

    user.xp -= premiumCost;
    user.isPremium = true;
    await user.save();

    res.json({ message: 'Premium purchased successfully', remainingXp: user.xp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 