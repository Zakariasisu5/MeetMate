
const User = require('../models/User');
const { sensayService } = require('../dist/services/sensay');

async function findTopMatches(currentUserId, topN = 3) {
  const currentUser = await User.findById(currentUserId);
  const users = await User.find({ _id: { $ne: currentUserId } });
  // Use Sensay API to get recommendations
  const preferences = {
    skills: currentUser.skills,
    interests: currentUser.interests,
    goals: currentUser.goals,
    bio: currentUser.bio
  };
  const context = users.map(u => ({
    id: u._id,
    skills: u.skills,
    interests: u.interests,
    goals: u.goals,
    bio: u.bio
  }));
  const response = await sensayService.recommend({ preferences, context });
  // Assume response.recommendations is an array of user IDs
  return response.recommendations.slice(0, topN);
}

module.exports = { findTopMatches };
