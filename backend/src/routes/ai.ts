import { Router, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { sensayService } from '../services/sensay';
import { AuthenticatedRequest, SensayChatRequest, SensayRecommendationRequest } from '../types/index';

const router = Router();

// POST /api/ai/chat - Chat with Sensay AI
router.post('/chat', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message, context } = req.body;
    const userId = req.user!.id;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const request: SensayChatRequest = {
      message,
    };

    const response = await sensayService.chat(request);
    res.json(response);
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// POST /api/ai/recommend - Get AI recommendations
router.post('/recommend', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { context } = req.body;
    const userId = req.user!.id;

    if (!context) {
      return res.status(400).json({ error: 'Context is required' });
    }

    const request: SensayRecommendationRequest = {
      userId,
      context,
    };

    const response = await sensayService.getRecommendations(request);
    res.json(response);
  } catch (error) {
    console.error('Error in AI recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

export default router;
