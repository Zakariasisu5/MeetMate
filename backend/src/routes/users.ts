import { Router, Response } from 'express';
import { collections } from '../config/firebase';
import { authenticateToken } from '../middleware/auth';
import { AuthenticatedRequest, User } from '../types/index';

const router = Router();

// POST /api/users - Create or update user profile
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email } = req.body;
    const userId = req.user!.id;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const userData: Omit<User, 'id'> = {
      name,
      email,
    };

    // Check if user already exists
    const existingUser = await collections.users.doc(userId).get();

    if (existingUser.exists) {
      // Update existing user
      await collections.users.doc(userId).update({
        name,
        email,
        updatedAt: new Date(),
      });

      const updatedData = existingUser.data()!;
      const user: User = {
        id: userId,
        name,
        email,
      };

      return res.json(user);
    }

    // Create new user
  await collections.users.doc(userId).set(userData);
  const user: User = { id: userId, ...userData };
  res.status(201).json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Failed to create/update user' });
  }
});

// GET /api/users/:id - Get user profile
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await collections.users.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const data = doc.data()!;
    const user: User = {
      id: doc.id,
      name: data.name,
      email: data.email,
    };
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
