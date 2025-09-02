"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = require("../config/firebase");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST /api/events - Create new event
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { name, date, location } = req.body;
        const userId = req.user?.id;
        if (!name || !date || !location) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const eventData = {
            name,
            date: new Date(date).toISOString(),
            location,
            createdBy: userId || '',
        };
        const docRef = await firebase_1.collections.events.add(eventData);
        const event = { id: docRef.id, ...eventData };
        res.status(201).json(event);
    }
    catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});
// GET /api/events - List all events
router.get('/', async (req, res) => {
    try {
        const snapshot = await firebase_1.collections.events.orderBy('date', 'asc').get();
        const events = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            events.push({
                id: doc.id,
                name: data.name,
                date: typeof data.date === 'string' ? data.date : data.date?.toDate?.().toISOString?.() || '',
                location: data.location,
                createdBy: data.createdBy,
            });
        });
        res.json(events);
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});
// GET /api/events/:id - Get specific event
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await firebase_1.collections.events.doc(id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const data = doc.data();
        const event = {
            id: doc.id,
            name: data.name,
            date: typeof data.date === 'string' ? data.date : data.date?.toDate?.().toISOString?.() || '',
            location: data.location,
            createdBy: data.createdBy,
        };
        res.json(event);
    }
    catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});
exports.default = router;
//# sourceMappingURL=events.js.map