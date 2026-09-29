/**
 * CompIntel AI - AI Analyst Chat REST API Route
 */

import express from 'express';
import { runCompetitiveAnalysis } from '../agents/competitiveIntelligenceAgent.ts';

const router = express.Router();

/**
 * POST /api/chat
 * Main conversational interface for AI Analyst connected to Hindsight Memory & Groq LLM
 */
router.post('/', async (req, res) => {
  try {
    const { message, competitorId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Field 'message' is required and must be a string."
      });
    }

    const result = await runCompetitiveAnalysis(message, competitorId);

    res.json({
      success: true,
      reply: result.answer,
      memoriesUsed: result.memoriesUsed,
      detectedPatterns: result.detectedPatterns,
      timelineEvents: result.timelineEvents,
      memoryContext: result.memoriesUsed,
      provider: result.meta.provider,
      timestamp: result.meta.timestamp
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
