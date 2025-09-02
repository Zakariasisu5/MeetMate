"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const firebase_1 = require("../config/firebase");
const router = (0, express_1.Router)();
// GET /messages/:id - fetch chat history with user :id
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const otherId = req.params.id;
        const snapshot = await firebase_1.collections.messages
            .where('participants', 'array-contains', userId)
            .orderBy('timestamp', 'asc')
            .get();
        const messages = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter((m) => m.participants && m.participants.includes(otherId));
        res.json({ messages });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
// POST /messages/:id - send new message to user :id
router.post('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const from = req.user.id;
        const to = req.params.id;
        const { content } = req.body;
        const messageData = {
            participants: [from, to],
            from,
            to,
            content,
            timestamp: new Date(),
        };
        const docRef = await firebase_1.collections.messages.add(messageData);
        res.status(201).json({ id: docRef.id, ...messageData });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});
exports.default = router;
//# sourceMappingURL=messages.js.map