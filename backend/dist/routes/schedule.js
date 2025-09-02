"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const calendar_1 = require("../services/calendar");
const router = (0, express_1.Router)();
// POST /schedule - create a meeting
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { participants, summary, description, start, end, meetingLink } = req.body;
        const meeting = await (0, calendar_1.createMeeting)({ userId, participants, summary, description, start, end, meetingLink });
        res.status(201).json(meeting);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create meeting' });
    }
});
// GET /schedule/:id - get meetings for user
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;
        const meetings = await (0, calendar_1.getMeetings)(userId);
        res.json({ meetings });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch meetings' });
    }
});
exports.default = router;
//# sourceMappingURL=schedule.js.map