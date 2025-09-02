"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const db = firebase_admin_1.default.firestore();
const router = (0, express_1.Router)();
// ...existing connection routes...
// Get pending requests for a user
router.get('/pending/:userId', async (req, res) => {
    const { userId } = req.params;
    const pending = await db.collection('connections')
        .where('receiverId', '==', userId)
        .where('status', '==', 'pending')
        .get();
    const requests = await Promise.all(pending.docs.map(async (doc) => {
        const data = doc.data();
        // Optionally fetch sender's name from users collection
        let senderName = data.senderId;
        try {
            const userDoc = await db.collection('users').doc(data.senderId).get();
            if (userDoc.exists)
                senderName = userDoc.data()?.name || data.senderId;
        }
        catch { }
        return { id: doc.id, senderId: data.senderId, senderName };
    }));
    res.json({ requests });
});
exports.default = router;
//# sourceMappingURL=connections-pending.js.map