import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { sensayService } from '../services/sensay.js';
const router = Router();
// POST /api/ai/chat - Chat with Sensay AI
router.post('/chat', authenticateToken, async (req, res) => {
    try {
        const { prompt, context } = req.body;
        const userId = req.user.uid;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        const request = {
            prompt,
            userId,
            context,
        };
        const response = await sensayService.chat(request);
        res.json(response);
    }
    catch (error) {
        console.error('Error in AI chat:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});
// POST /api/ai/recommend - Get AI recommendations
router.post('/recommend', authenticateToken, async (req, res) => {
    try {
        const { preferences } = req.body;
        const userId = req.user.uid;
        if (!preferences || !preferences.interests) {
            return res.status(400).json({ error: 'Preferences with interests are required' });
        }
        const request = {
            userId,
            preferences: {
                interests: preferences.interests,
                location: preferences.location,
                dateRange: preferences.dateRange ? {
                    start: new Date(preferences.dateRange.start),
                    end: new Date(preferences.dateRange.end),
                } : undefined,
            },
        };
        const response = await sensayService.getRecommendations(request);
        res.json(response);
    }
    catch (error) {
        console.error('Error in AI recommendations:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
});
export default router;
//# sourceMappingURL=ai.js.map