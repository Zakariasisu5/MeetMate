const express = require('express');
const router = express.Router();
const { sensayService } = require('../dist/services/sensay');

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  try {
    // Accept both 'prompt' and 'message' for compatibility
    const { prompt, message, context } = req.body;
    const msg = prompt || message;
    if (!msg) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const response = await sensayService.chat({ message: msg, context });
    res.json({ response: response.reply });
  } catch (err) {
    console.error('AI Chat error:', err);
    if (err.response) {
      console.error('Sensay API response:', err.response.data);
      res.status(500).json({ error: 'Sensay API error', details: err.response.data });
    } else {
      res.status(500).json({ error: 'Failed to connect to Sensay AI.', details: err.message });
    }
  }
});

// POST /api/ai/recommend
router.post('/recommend', async (req, res) => {
  try {
    const { preferences, context } = req.body;
    const response = await sensayService.getRecommendations({ preferences, context });
    res.json({ response: response.reply, recommendations: response.recommendations });
  } catch (err) {
    console.error('AI Recommend error:', err);
    if (err.response) {
      console.error('Sensay API response:', err.response.data);
      res.status(500).json({ error: 'Sensay API error', details: err.response.data });
    } else {
      res.status(500).json({ error: 'Failed to connect to Sensay AI.', details: err.message });
    }
  }
});

module.exports = router;
