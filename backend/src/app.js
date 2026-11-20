import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import Routes
import userRoutes from './routes/userRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import battleRoutes from './routes/battleRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

// Import Middlewares
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsers
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Root welcome / health check
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Code Armada — AI-Powered Coding Battle Arena',
    module: 'Member 4: Database Design & Management',
    status: 'Operational',
    documentation: '/api/docs',
    endpoints: {
      users: '/api/users',
      problems: '/api/problems',
      battles: '/api/battles',
      submissions: '/api/submissions',
      interviews: '/api/interviews',
      results: '/api/results',
      leaderboard: '/api/results/leaderboard',
      health: '/api/health',
    },
  });
});

// System Health API Endpoint
app.get('/api/health', (req, res) => {
  const dbStateMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  const dbState = mongoose.connection.readyState;

  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? 'Healthy' : 'Degraded',
    database: {
      status: dbStateMap[dbState] || 'Unknown',
      host: mongoose.connection.host || 'N/A',
      name: mongoose.connection.name || 'N/A',
    },
    uptime: `${Math.round(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/battles', battleRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/results', resultRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
