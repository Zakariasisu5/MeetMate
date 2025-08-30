const { Configuration, OpenAIApi } = require('openai');
const cosineSimilarity = require('compute-cosine-similarity');
const User = require('../models/User');

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

async function getUserEmbedding(user) {
  const text = [user.skills, user.interests, user.goals, user.bio].flat().join(' ');
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data.data[0].embedding;
}

async function findTopMatches(currentUserId, topN = 3) {
  const currentUser = await User.findById(currentUserId);
  const users = await User.find({ _id: { $ne: currentUserId } });
  const currentEmbedding = await getUserEmbedding(currentUser);
  const scored = [];
  for (const user of users) {
    const embedding = await getUserEmbedding(user);
    const score = cosineSimilarity(currentEmbedding, embedding);
    scored.push({ user, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN).map(s => s.user);
}

module.exports = { findTopMatches };
