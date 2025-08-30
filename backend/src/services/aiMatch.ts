import { collections } from '../config/firebase';

import axios from 'axios';


async function getUserEmbedding(user: any): Promise<number[]> {
  const text = [user.skills, user.interests, user.goals, user.bio].flat().join(' ');
  const response = await axios.post(
    process.env.SENSAY_API_URL || 'https://api.sensay.ai/v1/embedding',
    { text },
    {
      headers: {
        'Authorization': `Bearer ${process.env.SENSAY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.embedding;
}

export async function findTopMatches(userId: string, topN = 3) {
  const userDoc = await collections.users.doc(userId).get();
  if (!userDoc.exists) throw new Error('User not found');
  const currentUser = userDoc.data();
  const currentEmbedding = await getUserEmbedding(currentUser);

  const usersSnapshot = await collections.users.get();
  const scored: { user: any; score: number }[] = [];
  usersSnapshot.forEach(doc => {
    if (doc.id !== userId) {
      const user = doc.data();
      getUserEmbedding(user).then(embedding => {
        const score = cosineSimilarity(currentEmbedding, embedding);
        scored.push({ user: { id: doc.id, ...user }, score });
      });
    }
  });
  // Wait for all embeddings
  await new Promise(res => setTimeout(res, 2000));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN).map(s => s.user);
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
}
