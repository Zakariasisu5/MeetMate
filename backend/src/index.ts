// ...existing code...
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import eventsRouter from './routes/events';
import rsvpRouter from './routes/rsvp';
import aiRouter from './routes/ai';
import usersRouter from './routes/users';
import connectionsRouter from './routes/connections';
import connectionsPendingRouter from './routes/connections-pending';
import matchRouter from './routes/match';
import messagesRouter from './routes/messages';

// Load environment variables
dotenv.config();

import scheduleRouter from './routes/schedule';
// ...existing code...

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/events', eventsRouter);
app.use('/api/rsvp', rsvpRouter);
app.use('/api/ai', aiRouter);
app.use('/api/users', usersRouter);
app.use('/api/connections', connectionsRouter);
app.use('/api/connections', connectionsPendingRouter);
app.use('/api/match', matchRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/schedule', scheduleRouter);

// Integrate schedule (meetings) route
app.use('/api/schedule', scheduleRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MeetMate Backend Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
