const express = require('express');
const cors = require('cors');
const http = require('http');
const setupSocket = require('./socket');

// Load env vars
require('dotenv').config();

const app = express();
const server = http.createServer(app);
setupSocket(server);

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/ai', require('./routes/ai'));
app.use('/api/ai', require('./routes/gpt5'));
app.use('/match', require('./routes/match'));
app.use('/messages', require('./routes/messages'));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
