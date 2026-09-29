/**
 * CompIntel AI - Events REST API Routes
 */

import express from 'express';
import { eventService } from '../services/eventService.js';

const router = express.Router();

/**
 * GET /api/events
 * Query memory events with optional filters (query, competitorId, category, limit)
 */
router.get('/', async (req, res) => {
  try {
    const { query, competitorId, category, limit } = req.query;
    const events = await eventService.getEvents({
      query,
      competitorId,
      category,
      limit: limit ? parseInt(limit, 10) : 50
    });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/events
 * Index a new competitor event into long-term Hindsight memory
 */
router.post('/', async (req, res) => {
  try {
    const { competitorId, title, summary, category, severity, impactScore, strategicShift, tags, sourceUrl } = req.body;

    if (!competitorId || !title || !summary) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: competitorId, title, and summary are required."
      });
    }

    const createdEvent = await eventService.createEvent({
      competitorId,
      title,
      summary,
      category,
      severity,
      impactScore,
      strategicShift,
      tags,
      sourceUrl
    });

    res.status(201).json({
      success: true,
      message: "Event successfully indexed into Hindsight Memory",
      data: createdEvent
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
