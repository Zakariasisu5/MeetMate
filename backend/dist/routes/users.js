"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = require("../config/firebase");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST /api/users - Create or update user profile
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { name, email } = req.body;
        const userId = req.user.id;
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        const userData = {
            name,
            email,
        };
        // Check if user already exists
        const existingUser = await firebase_1.collections.users.doc(userId).get();
        if (existingUser.exists) {
            // Update existing user
            await firebase_1.collections.users.doc(userId).update({
                name,
                email,
                updatedAt: new Date(),
            });
            const updatedData = existingUser.data();
            const user = {
                id: userId,
                name,
                email,
            };
            return res.json(user);
        }
        // Create new user
        await firebase_1.collections.users.doc(userId).set(userData);
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
        const doc = await firebase_1.collections.users.doc(id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        const data = doc.data();
        const user = {
            id: doc.id,
            name: data.name,
            email: data.email,
        };
        res.json(user);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map