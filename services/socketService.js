const socketIO = require('socket.io');
let io;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost',
  'http://159.65.174.111',
  'https://159.65.174.111'
];

// Allow override from environment variable (comma-separated)
if (process.env.CORS_ORIGIN) {
  if (process.env.CORS_ORIGIN === '*') {
    allowedOrigins.push('*');
  } else {
    allowedOrigins.push(...process.env.CORS_ORIGIN.split(','));
  }
}

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

const emitNewOrder = (order) => {
  const io = getIO();
  io.emit('new-order', order);
};

const emitOrderUpdate = (order) => {
  const io = getIO();
  io.emit('order-update', order);
};

module.exports = {
  initializeSocket,
  getIO,
  emitNewOrder,
  emitOrderUpdate
}; 