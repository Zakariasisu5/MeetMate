const { Server } = require('socket.io');
const Message = require('./models/Message');

function setupSocket(server) {
  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    // Join room for user
    socket.on('join', (userId) => {
      socket.join(userId);
    });

    // Handle sending message
    socket.on('private_message', async ({ from, to, content }) => {
      const message = new Message({ from, to, content });
      await message.save();
      io.to(to).emit('private_message', { from, to, content, timestamp: message.timestamp });
      io.to(from).emit('private_message', { from, to, content, timestamp: message.timestamp });
    });
  });
}

module.exports = setupSocket;
