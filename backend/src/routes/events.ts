import { Router, Request, Response } from 'express';
import { collections } from '../config/firebase';
import { authenticateToken } from '../middleware/auth';
import { AuthenticatedRequest, Event } from '../types/index';

const router = Router();

// POST /api/events - Create new event
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, date, location } = req.body;
    const userId = req.user?.id;

    if (!name || !date || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const eventData: Omit<Event, 'id'> = {
      name,
      date: new Date(date).toISOString(),
      location,
      createdBy: userId || '',
    };

    const docRef = await collections.events.add(eventData);
    const event: Event = { id: docRef.id, ...eventData };

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// GET /api/events - List all events
router.get('/', async (req: Request, res: Response) => {
  try {
    const snapshot = await collections.events.orderBy('date', 'asc').get();
    const events: Event[] = [];
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
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/:id - Get specific event
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await collections.events.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const data = doc.data()!;
    const event: Event = {
      id: doc.id,
      name: data.name,
      date: typeof data.date === 'string' ? data.date : data.date?.toDate?.().toISOString?.() || '',
      location: data.location,
      createdBy: data.createdBy,
    };
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

export default router;
