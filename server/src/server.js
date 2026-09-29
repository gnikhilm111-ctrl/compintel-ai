/**
 * CompIntel AI - Express Server Entry Point
 */

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import competitorsRouter from './routes/competitors.js';
import eventsRouter from './routes/events.js';
import chatRouter from './routes/chat.js';
import analysisRouter from './routes/analysis.js';
import { getHindsightHealth, hindsightMemoryService } from './services/hindsightMemoryService.js';
import { logger } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/competitors', competitorsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api', analysisRouter); // exposes GET /api/stats

// Root Health Check Endpoint
app.get('/api/health', async (req, res) => {
  const hindsightHealth = await getHindsightHealth();
  res.json({
    status: 'online',
    app: 'CompIntel AI',
    version: '1.0.0',
    llmProvider: process.env.GROQ_API_KEY ? 'Groq API (llama-3.3-70b)' : 'CompIntel Local Engine',
    hindsightCloud: hindsightHealth,
    timestamp: new Date().toISOString()
  });
});

// Explicit Hindsight Health Check Endpoint
app.get('/api/hindsight/health', async (req, res) => {
  const health = await getHindsightHealth();
  res.json(health);
});

// Safe Hindsight Memory Diagnostic Endpoint
app.get('/api/hindsight/debug-memory', async (req, res) => {
  try {
    const testQuery = req.query.query || "NovaStack enterprise FedRAMP security";
    const debugResult = await hindsightMemoryService.debugMemory(testQuery);
    res.json({
      success: true,
      data: debugResult
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error on ${req.method} ${req.url}:`, err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, () => {
  logger.info(`=================================================`);
  logger.info(`🚀 CompIntel AI Backend Server listening on port ${PORT}`);
  logger.info(`📡 Health Check: http://localhost:${PORT}/api/health`);
  logger.info(`=================================================`);
});
