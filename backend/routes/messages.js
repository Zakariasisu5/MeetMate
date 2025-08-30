const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// GET /messages/:id - fetch chat history with user :id
router.get('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const otherId = req.params.id;
    const messages = await Message.find({
      $or: [
        { from: userId, to: otherId },
        { from: otherId, to: userId }
      ]
    }).sort({ timestamp: 1 });
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /messages/:id - send new message to user :id
router.post('/:id', auth, async (req, res) => {
  try {
    const from = req.user.id;
    const to = req.params.id;
    const { content } = req.body;
    const message = new Message({ from, to, content });
    await message.save();
    res.status(201).json({ message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
