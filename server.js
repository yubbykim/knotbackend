const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express(); // creates endpoints
const port = process.env.PORT || 3000; 

app.use(bodyParser.json());

// Connect to MongoDB (replace 'your_database_uri' with your MongoDB connection string)
mongoose.connect('mongodb+srv://yubbykim:KW76HbgGpLDNip5a@cluster0.zu3rjru.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// Define MongoDB Schemas and Models
const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone_number: Number,
  location: String,
  id: Number,
  bio: String
});

const activitySchema = new mongoose.Schema({
  activity_name: String,
  required_skills: String,
  id: Number,
});

const Profile = mongoose.model('Profile', profileSchema);
const Activity = mongoose.model('Activity', activitySchema);

// API Endpoints

// Get all profiles
app.get('/profiles', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new profile
app.post('/profiles', async (req, res) => {
  const profile = new Profile({
    skills: req.body.skills,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone_number: req.body.phone_number,
    location: req.body.location,
    id: req.body.id,
    bio: req.body.bio
  });

  try {
    const newProfile = await profile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all activities
app.get('/activities', async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new activity
app.post('/activities', async (req, res) => {
  const activity = new Activity({
    activity_name: req.body.activity_name,
    required_skills: req.body.required_skills,
    id: req.body.id
  });

  try {
    const newActivity = await activity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
