import { Router } from 'express';
import { collections } from '../config/firebase.js';
import { authenticateToken } from '../middleware/auth.js';
const router = Router();
// POST /api/events - Create new event
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, description, date, location } = req.body;
        const userId = req.user.uid;
        if (!title || !description || !date || !location) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const eventData = {
            title,
            description,
            date: new Date(date),
            location,
            createdBy: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const docRef = await collections.events.add(eventData);
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
        const snapshot = await collections.events
            .orderBy('date', 'asc')
            .get();
        const events = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            events.push({
                id: doc.id,
                ...data,
                date: data.date.toDate(),
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate(),
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
        const doc = await collections.events.doc(id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const data = doc.data();
        const event = {
            id: doc.id,
            ...data,
            date: data.date.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        };
        res.json(event);
    }
    catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});
export default router;
//# sourceMappingURL=events.js.map