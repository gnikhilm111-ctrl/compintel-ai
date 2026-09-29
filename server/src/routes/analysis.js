/**
 * CompIntel AI - Deep Strategy Analysis & Stats Routes
 */

import express from 'express';
import { runCompetitiveAnalysis } from '../agents/competitiveIntelligenceAgent.ts';
import { competitorService } from '../services/competitorService.js';

const router = express.Router();

/**
 * GET /api/stats
 * Dashboard summary statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await competitorService.getDashboardStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/analysis/strategy & POST /api/analysis/competitive
 * Trigger CompetitiveIntelligenceAgent evidence-based analysis report
 */
const handleAnalysis = async (req, res) => {
  try {
    const { query, question, competitorId } = req.body;
    const userQuery = question || query;

    if (!userQuery) {
      return res.status(400).json({
        success: false,
        error: "Field 'question' or 'query' is required."
      });
    }

    const report = await runCompetitiveAnalysis(userQuery, competitorId);

    res.json({
      success: true,
      data: {
        analysis: report.answer,
        answer: report.answer,
        memoriesUsed: report.memoriesUsed,
        detectedPatterns: report.detectedPatterns,
        timelineEvents: report.timelineEvents,
        meta: report.meta
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

router.post('/strategy', handleAnalysis);
router.post('/competitive', handleAnalysis);

export default router;
