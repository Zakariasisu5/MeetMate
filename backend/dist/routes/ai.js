"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const sensay_1 = require("../services/sensay");
const router = (0, express_1.Router)();
// POST /api/ai/chat - Chat with Sensay AI
router.post('/chat', auth_1.authenticateToken, async (req, res) => {
    try {
        const { message, context } = req.body;
        const userId = req.user.id;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const request = {
            message,
        };
        const response = await sensay_1.sensayService.chat(request);
        res.json(response);
    }
    catch (error) {
        console.error('Error in AI chat:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});
// POST /api/ai/recommend - Get AI recommendations
router.post('/recommend', auth_1.authenticateToken, async (req, res) => {
    try {
        const { context } = req.body;
        const userId = req.user.id;
        if (!context) {
            return res.status(400).json({ error: 'Context is required' });
        }
        const request = {
            userId,
            context,
        };
        const response = await sensay_1.sensayService.getRecommendations(request);
        res.json(response);
    }
    catch (error) {
        console.error('Error in AI recommendations:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
});
exports.default = router;
//# sourceMappingURL=ai.js.map