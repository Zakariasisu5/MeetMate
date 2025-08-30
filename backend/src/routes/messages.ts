import { Router, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { collections } from '../config/firebase';
import { AuthenticatedRequest } from '../types/index';

const router = Router();

// GET /messages/:id - fetch chat history with user :id
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const otherId = req.params.id;
    const snapshot = await collections.messages
      .where('participants', 'array-contains', userId)
      .orderBy('timestamp', 'asc')
      .get();
    const messages = snapshot.docs
      .map(doc => ({ id: doc.id, ...(doc.data() as { participants: string[]; [key: string]: any }) }))
      .filter((m: { participants: string[] }) => m.participants && m.participants.includes(otherId));
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /messages/:id - send new message to user :id
router.post('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const from = req.user!.id;
    const to = req.params.id;
    const { content } = req.body;
    const messageData = {
      participants: [from, to],
      from,
      to,
      content,
      timestamp: new Date(),
    };
    const docRef = await collections.messages.add(messageData);
    res.status(201).json({ id: docRef.id, ...messageData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
