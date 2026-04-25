const mongoose = require('mongoose');

// Singleton pattern: single shared connection instance
let connection = null;

const connectDB = async () => {
  if (connection) return connection;

  try {
    connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
