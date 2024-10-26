const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// User model
const userSchema = new mongoose.Schema({
  spotifyId: String,
  name: String,
  email: String,
  hasAccess: Boolean,
  isPremium: Boolean,
  lastAccessAttempt: Date
});

const User = mongoose.model('User', userSchema);

// Routes
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
        lastAccessAttempt: new Date()
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

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});