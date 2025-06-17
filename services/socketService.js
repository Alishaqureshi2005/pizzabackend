const socketIO = require('socket.io');
let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
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