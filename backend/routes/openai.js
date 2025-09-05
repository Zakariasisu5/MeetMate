const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST /api/openai/chat
router.post('/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
  try {
    const apiKey = process.env.API_KEY;
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 256
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    const answer = response.data.choices?.[0]?.message?.content || 'No response.';
    res.json({ response: answer });
  } catch (err) {
    res.status(500).json({ error: 'OpenAI API error', details: err.message });
  }
});

module.exports = router;
