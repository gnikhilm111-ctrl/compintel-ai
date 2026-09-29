/**
 * CompIntel AI - Event Service
 */

import { hindsightMemoryService } from './hindsightMemoryService.js';
import { competitorService } from './competitorService.js';

export const eventService = {
  getEvents: async (filters = {}) => {
    return hindsightMemoryService.queryMemory(filters);
  },

  getEventsByCompetitor: async (competitorId) => {
    return hindsightMemoryService.getCompetitorMemory(competitorId);
  },

  createEvent: async (eventData) => {
    // Lookup competitor name if missing
    if (!eventData.competitorName && eventData.competitorId) {
      const comp = await competitorService.getCompetitorById(eventData.competitorId);
      if (comp) {
        eventData.competitorName = comp.name;
      }
    }
    return hindsightMemoryService.storeEvent(eventData);
  }
};
