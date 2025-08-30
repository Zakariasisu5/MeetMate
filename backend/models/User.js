const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: [String],
  interests: [String],
  goals: [String],
  bio: String,
  profilePic: String,
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  googleOAuth: Object,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
