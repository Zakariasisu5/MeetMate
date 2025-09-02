const express = require('express');
const router = express.Router();
const { findTopMatches } = require('../services/ai');

// POST /match - get top matches for current user
router.post('/', async (req, res) => {
  try {
    // Use userId from request body for now
    const userId = req.body.userId;
    const matches = await findTopMatches(userId);
    res.json({ matches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to find matches' });
  }
});

module.exports = router;
