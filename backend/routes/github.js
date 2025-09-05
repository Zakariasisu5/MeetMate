const express = require('express');
const axios = require('axios');
const router = express.Router();

// POST /api/github/search
router.post('/search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  try {
  const githubToken = process.env.GITHUB_TOKEN;
    const response = await axios.get(`https://api.github.com/search/issues?q=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const items = (response.data.items || []).slice(0, 3).map(item => ({
      title: item.title,
      url: item.html_url,
      summary: item.body ? item.body.replace(/#[A-Za-z0-9_-]+/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').substring(0, 200) + '...' : 'No summary.'
    }));
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: 'GitHub API error', details: err.message });
  }
});

module.exports = router;
