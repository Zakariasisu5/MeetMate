import { Router, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createMeeting, getMeetings } from '../services/calendar';
import { AuthenticatedRequest } from '../types/index';

const router = Router();

// POST /schedule - create a meeting
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { participants, summary, description, start, end, meetingLink } = req.body;
    const meeting = await createMeeting({ userId, participants, summary, description, start, end, meetingLink });
    res.status(201).json(meeting);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create meeting' });
  }
});

// GET /schedule/:id - get meetings for user
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    const meetings = await getMeetings(userId);
    res.json({ meetings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

export default router;
