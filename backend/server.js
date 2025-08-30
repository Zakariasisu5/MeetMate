const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const setupSocket = require('./socket');

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app);
setupSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/match', require('./routes/match'));
app.use('/connect', require('./routes/connect'));
app.use('/messages', require('./routes/messages'));
app.use('/schedule', require('./routes/schedule'));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
