const socketIO = require('socket.io');
let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: [         // From .env       // From .env
        'http://localhost:3000',        // React/Vite dev server
        'http://localhost:5173',        // Vite default
        'http://localhost',             // Electron app
        'http://159.65.174.111'],
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