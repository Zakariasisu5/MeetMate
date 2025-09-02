"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const db = firebase_admin_1.default.firestore();
const router = (0, express_1.Router)();
// Send connection request
router.post('/request', async (req, res) => {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId || senderId === receiverId) {
        return res.status(400).json({ error: 'Invalid sender or receiver' });
    }
    // Prevent duplicate requests
    const existing = await db.collection('connections')
        .where('senderId', '==', senderId)
        .where('receiverId', '==', receiverId)
        .get();
    if (!existing.empty) {
        return res.status(409).json({ error: 'Request already sent' });
    }
    await db.collection('connections').add({
        senderId,
        receiverId,
        status: 'pending',
        timestamp: firebase_admin_1.default.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ success: true });
});
// Accept/decline connection request
router.post('/respond', async (req, res) => {
    const { connectionId, status } = req.body;
    if (!connectionId || !['accepted', 'declined'].includes(status)) {
        return res.status(400).json({ error: 'Invalid input' });
    }
    await db.collection('connections').doc(connectionId).update({ status });
    res.json({ success: true });
});
// Get user's connections (accepted)
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    // Find all accepted connections where user is sender or receiver
    const sent = await db.collection('connections')
        .where('senderId', '==', userId)
        .where('status', '==', 'accepted')
        .get();
    const received = await db.collection('connections')
        .where('receiverId', '==', userId)
        .where('status', '==', 'accepted')
        .get();
    const connections = [
        ...sent.docs.map(doc => doc.data().receiverId),
        ...received.docs.map(doc => doc.data().senderId),
    ];
    res.json({ connections });
});
exports.default = router;
//# sourceMappingURL=connections.js.map