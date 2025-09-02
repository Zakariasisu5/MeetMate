const express = require('express');
const cors = require('cors');
const http = require('http');
const setupSocket = require('./socket');

// Load env vars
require('dotenv').config();

const app = express();
const server = http.createServer(app);
setupSocket(server);

// CORS: allow frontend origin in production
const allowedOrigins = [
	process.env.FRONTEND_URL || 'http://localhost:5173',
	'https://meet-mate-ten.vercel.app', // Vercel production frontend
];
app.use(cors({
	origin: function (origin, callback) {
		// allow requests with no origin (like mobile apps, curl, etc.)
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) !== -1) {
			return callback(null, true);
		} else {
			return callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
}));
app.use(express.json());

// Health check for Render
app.get('/', (req, res) => {
	res.status(200).json({ status: 'ok', message: 'MeetMate backend running' });
});

// Routes
app.use('/api/ai', require('./routes/ai'));
app.use('/api/ai', require('./routes/gpt5'));
app.use('/match', require('./routes/match'));
app.use('/messages', require('./routes/messages'));

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
