const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST /api/github/search
router.post('/search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  try {
  const githubToken = process.env.GITHUB_TOKEN;
  // If you have a different API key variable, use it here
  // Example: const apiKey = process.env.MY_API_KEY;
    const response = await axios.get(`https://api.github.com/search/issues?q=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const answers = (response.data.items || []).slice(0, 3).map(item => {
      // Clean up the body: remove hashes, stars, excessive whitespace, and markdown formatting
      let text = item.body || '';
      text = text.replace(/#[A-Za-z0-9_-]+/g, ''); // Remove hashtags
      text = text.replace(/\*+/g, ''); // Remove stars
      text = text.replace(/`+/g, ''); // Remove backticks
      text = text.replace(/\n/g, ' '); // Remove newlines
      text = text.replace(/\s+/g, ' '); // Collapse whitespace
      text = text.replace(/\[(.*?)\]\((.*?)\)/g, '$1'); // Remove markdown links
      text = text.replace(/\!\[(.*?)\]\((.*?)\)/g, ''); // Remove images
      text = text.replace(/\>+/g, ''); // Remove blockquotes
      text = text.trim();
      if (!text) text = 'No answer available.';
      return text.substring(0, 500) + (text.length > 500 ? '...' : '');
    });
    res.json({ answers });
  } catch (err) {
    res.status(500).json({ error: 'GitHub API error', details: err.message });
  }
});

module.exports = router;
