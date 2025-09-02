"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ...existing code...
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import routes
const events_1 = __importDefault(require("./routes/events"));
const rsvp_1 = __importDefault(require("./routes/rsvp"));
const ai_1 = __importDefault(require("./routes/ai"));
const users_1 = __importDefault(require("./routes/users"));
const connections_1 = __importDefault(require("./routes/connections"));
const connections_pending_1 = __importDefault(require("./routes/connections-pending"));
const match_1 = __importDefault(require("./routes/match"));
const messages_1 = __importDefault(require("./routes/messages"));
// Load environment variables
dotenv_1.default.config();
const schedule_1 = __importDefault(require("./routes/schedule"));
// ...existing code...
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Security middleware
app.use((0, helmet_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api/events', events_1.default);
app.use('/api/rsvp', rsvp_1.default);
app.use('/api/ai', ai_1.default);
app.use('/api/users', users_1.default);
app.use('/api/connections', connections_1.default);
app.use('/api/connections', connections_pending_1.default);
app.use('/api/match', match_1.default);
app.use('/api/messages', messages_1.default);
app.use('/api/schedule', schedule_1.default);
// Integrate schedule (meetings) route
app.use('/api/schedule', schedule_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
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
//# sourceMappingURL=index.js.map