import { Router } from 'express';
import admin from 'firebase-admin';

const db = admin.firestore();
const router = Router();

// ...existing connection routes...

// Get pending requests for a user
router.get('/pending/:userId', async (req, res) => {
  const { userId } = req.params;
  const pending = await db.collection('connections')
    .where('receiverId', '==', userId)
    .where('status', '==', 'pending')
    .get();
  const requests = await Promise.all(pending.docs.map(async doc => {
    const data = doc.data();
    // Optionally fetch sender's name from users collection
    let senderName = data.senderId;
    try {
      const userDoc = await db.collection('users').doc(data.senderId).get();
      if (userDoc.exists) senderName = userDoc.data()?.name || data.senderId;
    } catch {}
    return { id: doc.id, senderId: data.senderId, senderName };
  }));
  res.json({ requests });
});

export default router;
