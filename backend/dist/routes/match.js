"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const aiMatch_1 = require("../services/aiMatch");
const router = (0, express_1.Router)();
// POST /match - get top matches for current user
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const matches = await (0, aiMatch_1.findTopMatches)(userId);
        res.json({ matches });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to find matches' });
    }
});
exports.default = router;
//# sourceMappingURL=match.js.map