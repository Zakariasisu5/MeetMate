import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { AuthenticatedRequest } from '../types/index.js';

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('[AUTH] Incoming headers:', req.headers);
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log('[AUTH] Extracted token:', token);

    if (!token) {
      console.warn('[AUTH] No token provided');
      return res.status(401).json({ error: 'Access token required' });
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      console.log('[AUTH] Decoded user:', decodedToken);
      req.user = {
        id: decodedToken.uid,
        email: decodedToken.email || '',
      };
      next();
    } catch (error) {
      console.error('[AUTH] Token verification failed:', error);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('[AUTH] Authentication middleware error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};
