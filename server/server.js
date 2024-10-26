const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const userSchema = new mongoose.Schema({
  spotifyId: String,
  name: String,
  email: String,
  hasAccess: Boolean,
  isPremium: Boolean,
  lastAccessAttempt: Date,
  recentlyPlayedSongs: [{
    songId: String,
    songName: String,
    artistName: String,
    playedAt: Date
  }]
});

const User = mongoose.model('User', userSchema);

const songHistorySchema = new mongoose.Schema({
  userId: String,
  songId: String,
  songName: String,
  artistName: String,
  playedAt: { type: Date, default: Date.now }
});

const SongHistory = mongoose.model('SongHistory', songHistorySchema);

app.post('/api/users', async (req, res) => {
  const { spotifyId, name, email, isPremium } = req.body;
  try {
    let user = await User.findOne({ spotifyId });
    if (user) {
      user.lastAccessAttempt = new Date();
      await user.save();
    } else {
      user = new User({
        spotifyId,
        name,
        email,
        hasAccess: true,
        isPremium,
        lastAccessAttempt: new Date(),
        recentlyPlayedSongs: []
      });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/users/:spotifyId', async (req, res) => {
  try {
    const user = await User.findOne({ spotifyId: req.params.spotifyId });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/song-history', async (req, res) => {
  const { userId, songId, songName, artistName } = req.body;
  try {
    const songHistory = new SongHistory({
      userId,
      songId,
      songName,
      artistName
    });
    await songHistory.save();

    const user = await User.findOne({ spotifyId: userId });
    if (user) {
      user.recentlyPlayedSongs.unshift({
        songId,
        songName,
        artistName,
        playedAt: new Date()
      });
      if (user.recentlyPlayedSongs.length > 50) {
        user.recentlyPlayedSongs.pop();
      }
      await user.save();
    }

    console.log('Song history saved:', songHistory);
    res.status(201).json({ message: 'Song history recorded successfully', songHistory });
  } catch (error) {
    console.error('Error saving song history:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/song-history/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ spotifyId: req.params.userId });
    if (user) {
      res.json(user.recentlyPlayedSongs);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});