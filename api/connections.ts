import { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory store for demo (replace with DB in production)
let connections: { senderId: string; receiverId: string; status: 'pending' | 'accepted' | 'rejected' }[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: 'senderId and receiverId are required' });
    }
    // Prevent duplicate requests
    const exists = connections.find(
      c => c.senderId === senderId && c.receiverId === receiverId && c.status === 'pending'
    );
    if (exists) {
      return res.status(409).json({ error: 'Connection request already sent' });
    }
    connections.push({ senderId, receiverId, status: 'pending' });
    return res.status(201).json({ message: 'Connection request sent' });
  }
  if (req.method === 'GET') {
    // Optionally filter by user
    const { userId } = req.query;
    if (userId) {
      const userConnections = connections.filter(
        c => c.senderId === userId || c.receiverId === userId
      );
      return res.status(200).json(userConnections);
    }
    return res.status(200).json(connections);
  }
  res.status(405).json({ error: 'Method not allowed' });
}
