"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = require("../config/firebase");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST /api/rsvp - RSVP to event
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { eventId, status } = req.body;
        const userId = req.user.id;
        if (!eventId || !status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (!['yes', 'maybe', 'no'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        // Check if event exists
        const eventDoc = await firebase_1.collections.events.doc(eventId).get();
        if (!eventDoc.exists) {
            return res.status(404).json({ error: 'Event not found' });
        }
        // Check if RSVP already exists
        const existingRsvpQuery = await firebase_1.collections.rsvps
            .where('userId', '==', userId)
            .where('eventId', '==', eventId)
            .get();
        if (!existingRsvpQuery.empty) {
            // Update existing RSVP
            const existingRsvp = existingRsvpQuery.docs[0];
            await existingRsvp.ref.update({
                status,
                updatedAt: new Date(),
            });
            const updatedData = existingRsvp.data();
            const rsvp = {
                id: existingRsvp.id,
                userId,
                eventId,
                status,
            };
            return res.json(rsvp);
        }
        // Create new RSVP
        const rsvpData = {
            userId,
            eventId,
            status,
        };
        const docRef = await firebase_1.collections.rsvps.add({
            ...rsvpData,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const rsvp = { id: docRef.id, ...rsvpData };
        res.status(201).json(rsvp);
    }
    catch (error) {
        console.error('Error creating RSVP:', error);
        res.status(500).json({ error: 'Failed to create RSVP' });
    }
});
// GET /api/rsvp/event/:eventId - Get RSVPs for an event
router.get('/event/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const snapshot = await firebase_1.collections.rsvps
            .where('eventId', '==', eventId)
            .get();
        const rsvps = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            rsvps.push({
                id: doc.id,
                userId: data.userId,
                eventId: data.eventId,
                status: data.status,
            });
        });
        res.json(rsvps);
    }
    catch (error) {
        console.error('Error fetching RSVPs:', error);
        res.status(500).json({ error: 'Failed to fetch RSVPs' });
    }
});
// GET /api/rsvp/user/:userId - Get user's RSVPs
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const snapshot = await firebase_1.collections.rsvps
            .where('userId', '==', userId)
            .get();
        const rsvps = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            rsvps.push({
                id: doc.id,
                userId: data.userId,
                eventId: data.eventId,
                status: data.status,
            });
        });
        res.json(rsvps);
    }
    catch (error) {
        console.error('Error fetching user RSVPs:', error);
        res.status(500).json({ error: 'Failed to fetch user RSVPs' });
    }
});
exports.default = router;
//# sourceMappingURL=rsvp.js.map