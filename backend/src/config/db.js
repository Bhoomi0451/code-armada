import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isDisconnectingIntentionally = false;

/**
 * Connect to MongoDB using Mongoose.
 * Supports both local MongoDB and MongoDB Atlas clusters.
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/code_armada';
  isDisconnectingIntentionally = false;

  try {
    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true, // Build indexes automatically in development
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if server unreachable
    });

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);

    // Listen to connection lifecycle events
    mongoose.connection.on('error', (err) => {
      console.error(`[MongoDB] Runtime connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      if (!isDisconnectingIntentionally) {
        console.warn('[MongoDB] Connection lost. Reconnecting...');
      }
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB] Successfully reconnected.');
    });

    return conn;
  } catch (error) {
    console.error(`[MongoDB] Initial connection failed: ${error.message}`);
    // If not in test environment, exit with failure code
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};

/**
 * Gracefully disconnect from MongoDB.
 */
export const disconnectDB = async () => {
  try {
    isDisconnectingIntentionally = true;
    await mongoose.connection.close();
    console.log('[MongoDB] Connection cleanly closed.');
  } catch (error) {
    console.error(`[MongoDB] Error during disconnection: ${error.message}`);
  }
};

// Graceful process exit handler
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

export default connectDB;
