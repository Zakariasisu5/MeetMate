const express = require('express');
const router = express.Router();
const { findTopMatches } = require('../services/ai');
const auth = require('../middleware/auth');

// POST /match - get top matches for current user
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const matches = await findTopMatches(userId);
    res.json({ matches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to find matches' });
  }
});

module.exports = router;
