const express = require('express');
const axios = require('axios');
const router = express.Router();

// In-memory store for Q&A
const qaStore = [];

// POST /api/sensay/ask
router.post('/ask', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  const sensayApiKey = process.env.SENSAY_API_KEY;
  if (!sensayApiKey) {
    console.error('SENSAY_API_KEY is not set. Cannot reach Sensay API.');
    return res.status(500).json({ error: 'Server misconfiguration', details: 'SENSAY_API_KEY not set' });
  }

  try {
    const sensayApiUrl = process.env.SENSAY_API_URL || 'https://api.sensay.ai/v1';
    const response = await axios.post(`${sensayApiUrl}/chat/completions`, {
      model: 'sensay-llama-3',
      messages: [
        { role: 'system', content: 'You are MeetMate AI. Answer any question about the MeetMate platform, its features, usage, and troubleshooting.' },
        { role: 'user', content: query }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${sensayApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 20_000,
    });

    const answer = response.data.choices?.[0]?.message?.content || 'No answer available.';
    // Store Q&A in memory
    qaStore.push({ question: query, answer });
    res.json({ answer });
  } catch (err) {
    // Log full error for debugging in development
    console.error('Error calling Sensay API:', err?.response?.data || err.message || err);
    const details = err?.response?.data?.error || err.message || 'Unknown error when calling Sensay API';
    res.status(500).json({ error: 'Sensay API error', details });
  }
});

// GET /api/sensay/qa - return all Q&A pairs
router.get('/qa', (req, res) => {
  res.json({ qa: qaStore });
});

module.exports = router;
