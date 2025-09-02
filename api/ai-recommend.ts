import { VercelRequest, VercelResponse } from '@vercel/node';
import { sensayService } from '../backend/src/services/sensay';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { preferences, context } = req.body;
      const response = await sensayService.getRecommendations({ preferences, context });
      res.json({ response: response.reply, recommendations: response.recommendations });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to connect to Sensay AI.', details: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
