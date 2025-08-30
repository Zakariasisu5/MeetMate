import { Router } from 'express';
import { collections } from '../config/firebase.js';
import { authenticateToken } from '../middleware/auth.js';
const router = Router();
// POST /api/users - Create or update user profile
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, email, avatar } = req.body;
        const userId = req.user.uid;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        const userData = {
            name,
            email,
            avatar,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        // Check if user already exists
        const existingUser = await collections.users.doc(userId).get();
        if (existingUser.exists) {
            // Update existing user
            await collections.users.doc(userId).update({
                name,
                email,
                avatar,
                updatedAt: new Date(),
            });
            const updatedData = existingUser.data();
            const user = {
                id: userId,
                name,
                email,
                avatar,
                createdAt: updatedData.createdAt.toDate(),
                updatedAt: new Date(),
            };
            return res.json(user);
        }
        // Create new user
        await collections.users.doc(userId).set(userData);
        const user = { id: userId, ...userData };
        res.status(201).json(user);
    }
    catch (error) {
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
        const data = doc.data();
        const user = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        };
        res.json(user);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
export default router;
//# sourceMappingURL=users.js.map