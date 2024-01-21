const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express(); // creates endpoints
const port = process.env.PORT || 3000;

const activity_mapping = {};

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Connect to MongoDB (replace 'your_database_uri' with your MongoDB connection string)
mongoose.connect(
  "mongodb+srv://yubbykim:KW76HbgGpLDNip5a@cluster0.zu3rjru.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Define MongoDB Schemas and Models
const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone_number: Number,
  experience: String,
  bio: String,
});

const activitySchema = new mongoose.Schema({
  activity_name: String,
  required_skills: String,
  experience: String,
});

const Profile = mongoose.model("Profile", profileSchema);
const Activity = mongoose.model("Activity", activitySchema);

// API Endpoints

// Get all profiles
app.get("/profiles/:id", async (req, res) => {
  const match = await Profile.findById(req.params.id).exec();
  const matchDetails = {
    name : match.name,
    phone_number : match.phone_number
  }
  res.json(matchDetails)

});

// Create a new profile
app.post("/profiles", async (req, res) => {
  const profile = new Profile({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone_number: req.body.phone_number,
    experience: req.body.experience,
    bio: req.body.bio,
  });

  try {
    const newProfile = await profile.save();
    console.log(newProfile);
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all activities
app.get("/activities", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new activity
app.post("/activities", async (req, res) => {
  const experiencing = await Profile.findById(req.body.profileId).exec();

  const experience = experiencing.experience;
  const existing = await Activity.findOne({
    activity_name: req.body.activity_name.toLowerCase(),
    required_skills: req.body.required_skills.toLowerCase(),
    experience: experience,
  }).exec();

  if (existing?._id) {
    // if found delete the found data
    const deleteResult = await Activity.deleteOne({
      activity_name: req.body.activity_name.toLowerCase(),
      required_skills: req.body.required_skills.toLowerCase(),
      experience: experience,
    }).exec();

    const matchedProfileId = activity_mapping[existing._id];

    const matchedProfile = await Profile.findById(matchedProfileId);

    res.status(200).json({ matchedProfile, activity: existing });
    return;
  } else {
    // if not found then make activity

    const activity = new Activity({
      activity_name: req.body.activity_name.toLowerCase(),
      required_skills: req.body.required_skills.toLowerCase(),
      experience: experience,
    });

    const profileId = req.body.profileId;

    try {
      const newActivity = await activity.save();

      activity_mapping[newActivity._id] = profileId;

      res.status(201).json({ newActivity, profileId });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
