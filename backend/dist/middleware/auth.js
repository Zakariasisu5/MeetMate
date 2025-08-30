import { auth } from '../config/firebase.js';
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }
        try {
            const decodedToken = await auth.verifyIdToken(token);
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email || '',
            };
            next();
        }
        catch (error) {
            console.error('Token verification failed:', error);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
    }
    catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
    }
};
//# sourceMappingURL=auth.js.map