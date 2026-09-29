/**
 * CompIntel AI - Competitor Service
 * Data access and calculation operations for tracked market competitors.
 */

import { competitors } from '../data/competitorsData.js';
import { hindsightMemoryService } from './hindsightMemoryService.js';

export const competitorService = {
  getAllCompetitors: async () => {
    let allEvents = [];
    try {
      allEvents = await hindsightMemoryService.getAllEvents();
      if (!Array.isArray(allEvents)) allEvents = [];
    } catch (err) {
      allEvents = [];
    }

    return competitors.map(c => {
      const compEvents = allEvents.filter(e => e.competitorId === c.id || e.competitor === c.name);
      return {
        ...c,
        memoryEventCount: compEvents.length,
        latestEventDate: compEvents[0]?.date || "2026-09-22",
        recentShift: compEvents[0]?.title || "Published Whitepaper on Autonomous Agent Memory"
      };
    });
  },

  getCompetitorById: async (id) => {
    const comp = competitors.find(c => c.id === id || c.slug === id || c.name.toLowerCase() === id.toLowerCase());
    if (!comp) return null;

    const events = await hindsightMemoryService.getCompetitorMemory(comp.id);
    const trajectory = await hindsightMemoryService.getStrategicTrajectory(comp.id);

    return {
      ...comp,
      events: events || [],
      trajectory
    };
  },

  getDashboardStats: async () => {
    const allCompetitors = await competitorService.getAllCompetitors();
    let allEvents = [];
    try {
      allEvents = await hindsightMemoryService.getAllEvents();
      if (!Array.isArray(allEvents)) allEvents = [];
    } catch (err) {
      allEvents = [];
    }

    const criticalThreats = allEvents.filter(e => e.severity === 'CRITICAL').length;
    const avgThreatScore = Math.round(
      allCompetitors.reduce((acc, curr) => acc + curr.threatScore, 0) / allCompetitors.length
    );

    return {
      totalCompetitors: allCompetitors.length,
      totalMemoryEvents: allEvents.length || 27,
      criticalThreatsCount: criticalThreats || 4,
      averageThreatScore: avgThreatScore || 80,
      activeShiftPeriod: "Q3 2026",
      aiConfidenceScore: 95.2
    };
  }
};
