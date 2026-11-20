import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

/**
 * Bootstrap application server.
 * Guarantees that the HTTP server only starts after successful MongoDB connection.
 */
const startServer = async () => {
  try {
    console.log('[Bootstrap] Initializing Code Armada Database & Server...');

    // 1. Establish database connection first
    await connectDB();

    // 2. Start HTTP listener
    const server = app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`⚔️  Code Armada Backend Server is running!`);
      console.log(`📍 Port: http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
      console.log('====================================================');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`[Process] Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    return server;
  } catch (error) {
    console.error(`[Bootstrap] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
