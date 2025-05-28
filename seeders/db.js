const mongoose = require('mongoose');
const config = require('../config/config');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(config.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    console.log('MongoDB connection closed');
  }
};

module.exports = { connectDB, closeDB }; 