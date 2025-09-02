import { VercelRequest, VercelResponse } from '@vercel/node';
import { sensayService } from '../backend/src/services/sensay';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { prompt, message, context } = req.body;
      const msg = prompt || message;
      if (!msg) {
        return res.status(400).json({ error: 'Message is required' });
      }
      const response = await sensayService.chat({ message: msg });
      res.json({ response: response.reply });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to connect to Sensay AI.', details: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
