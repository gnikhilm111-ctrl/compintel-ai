/**
 * CompIntel AI - Competitors REST API Routes
 */

import express from 'express';
import { competitorService } from '../services/competitorService.js';
import { eventService } from '../services/eventService.js';
import { liveResearchService } from '../services/liveResearchService.js';

const router = express.Router();

/**
 * GET /api/competitors
 * Returns list of all tracked competitors with summary memory statistics
 */
router.get('/', async (req, res) => {
  try {
    const list = await competitorService.getAllCompetitors();
    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/competitors/:id
 * Returns detailed profile, trajectory analysis, and memory count for a specific competitor
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const competitor = await competitorService.getCompetitorById(id);

    if (!competitor) {
      return res.status(404).json({
        success: false,
        error: `Competitor with ID or slug '${id}' not found.`
      });
    }

    res.json({
      success: true,
      data: competitor
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/competitors/:id/events
 * Returns Hindsight memory event stream for a specific competitor
 */
router.get('/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const events = await eventService.getEventsByCompetitor(id);

    res.json({
      success: true,
      competitorId: id,
      count: events.length,
      data: events
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/competitors/:id/research
 * Execute Live Competitor Research Workflow & Index New Signals into Hindsight Memory
 */
router.post('/:id/research', async (req, res) => {
  try {
    const { id } = req.params;
    const { topic } = req.body;

    const researchResult = await liveResearchService.researchCompetitor({
      competitorId: id,
      topic
    });

    res.json({
      success: true,
      message: "Live research completed and new events indexed into Hindsight Memory",
      data: researchResult
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
