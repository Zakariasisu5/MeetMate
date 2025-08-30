import { Router, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { findTopMatches } from '../services/aiMatch';
import { AuthenticatedRequest } from '../types/index';

const router = Router();

// POST /match - get top matches for current user
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const matches = await findTopMatches(userId);
    res.json({ matches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to find matches' });
  }
});

export default router;
