/**
 * CompIntel AI - Local Function Tools for Agent Engine
 * 
 * Implements simple, deterministic function tools connected to Hindsight / mock data.
 * Compatible with OpenAI / Groq tool-calling specification (tool_choice="auto").
 */

import { hindsightMemoryService } from '../services/hindsightMemoryService.js';
import { competitorService } from '../services/competitorService.js';
import { logger } from '../utils/logger.js';

// Tool 1: getCompetitorMemory
export async function getCompetitorMemory({ competitorId, query }: { competitorId?: string; query?: string }) {
  logger.info(`[TOOL:getCompetitorMemory] competitorId="${competitorId}", query="${query}"`);
  return hindsightMemoryService.queryMemory({ competitorId, query, limit: 10 });
}

// Tool 2: getCompetitorTimeline
export async function getCompetitorTimeline({
  competitorId,
  startDate,
  endDate
}: {
  competitorId?: string;
  startDate?: string;
  endDate?: string;
}) {
  logger.info(`[TOOL:getCompetitorTimeline] competitorId="${competitorId}", startDate="${startDate}", endDate="${endDate}"`);
  let events = competitorId 
    ? await hindsightMemoryService.getCompetitorMemory(competitorId)
    : await hindsightMemoryService.getAllEvents();

  if (!Array.isArray(events)) events = [];

  if (startDate) {
    events = events.filter((e) => new Date(e.date) >= new Date(startDate));
  }
  if (endDate) {
    events = events.filter((e) => new Date(e.date) <= new Date(endDate));
  }

  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Tool 3: compareCompetitors
export async function compareCompetitors({ competitorA, competitorB }: { competitorA: string; competitorB: string }) {
  logger.info(`[TOOL:compareCompetitors] competitorA="${competitorA}", competitorB="${competitorB}"`);
  
  const compA = await competitorService.getCompetitorById(competitorA);
  const compB = await competitorService.getCompetitorById(competitorB);

  return {
    competitorA: compA ? {
      name: compA.name,
      category: compA.category,
      threatScore: compA.threatScore,
      threatLevel: compA.threatLevel,
      marketShare: compA.marketShare,
      strategicFocus: compA.strategicFocus,
      techStack: compA.techStack,
      memoryEventCount: compA.events?.length || 0
    } : null,
    competitorB: compB ? {
      name: compB.name,
      category: compB.category,
      threatScore: compB.threatScore,
      threatLevel: compB.threatLevel,
      marketShare: compB.marketShare,
      strategicFocus: compB.strategicFocus,
      techStack: compB.techStack,
      memoryEventCount: compB.events?.length || 0
    } : null,
    keyDifferentiators: [
      `${compA?.name || competitorA} threat score is ${compA?.threatScore}/100 vs ${compB?.name || competitorB}'s ${compB?.threatScore}/100`,
      `${compA?.name || competitorA} primary focus: ${compA?.strategicFocus?.[0] || 'N/A'}`,
      `${compB?.name || competitorB} primary focus: ${compB?.strategicFocus?.[0] || 'N/A'}`
    ]
  };
}

// Tool 4: storeCompetitorEvent
export async function storeCompetitorEvent({
  competitor,
  date,
  category,
  title,
  description,
  source
}: {
  competitor: string;
  date?: string;
  category?: string;
  title: string;
  description: string;
  source?: string;
}) {
  logger.info(`[TOOL:storeCompetitorEvent] competitor="${competitor}", title="${title}"`);
  
  const createdEvent = await hindsightMemoryService.storeEvent({
    competitorId: competitor,
    title,
    summary: description,
    category: category || "General",
    date: date || new Date().toISOString().split('T')[0],
    sourceUrl: source || "https://compintel.ai/signal"
  });

  return {
    success: true,
    message: "Event successfully indexed into Hindsight Memory",
    event: createdEvent
  };
}

// Map of Tool Handlers
export const toolHandlers: Record<string, Function> = {
  getCompetitorMemory,
  getCompetitorTimeline,
  compareCompetitors,
  storeCompetitorEvent
};

// Groq / OpenAI Compatible Tools JSON Schema
export const agentToolsSchema = [
  {
    type: "function",
    function: {
      name: "getCompetitorMemory",
      description: "Query long-term Hindsight memory nodes for a specific competitor or keyword search.",
      parameters: {
        type: "object",
        properties: {
          competitorId: { type: "string", description: "Target competitor ID (e.g. novastack, cloudforge, datapilot)" },
          query: { type: "string", description: "Search query or keyword" }
        },
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getCompetitorTimeline",
      description: "Retrieve chronological event timeline for a competitor within optional date range.",
      parameters: {
        type: "object",
        properties: {
          competitorId: { type: "string", description: "Target competitor ID (e.g. novastack, cloudforge, datapilot)" },
          startDate: { type: "string", description: "Filter start date (YYYY-MM-DD)" },
          endDate: { type: "string", description: "Filter end date (YYYY-MM-DD)" }
        },
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "compareCompetitors",
      description: "Compare two competitors side-by-side across threat levels, tech stack, and strategic focus.",
      parameters: {
        type: "object",
        properties: {
          competitorA: { type: "string", description: "First competitor ID (e.g. novastack)" },
          competitorB: { type: "string", description: "Second competitor ID (e.g. cloudforge)" }
        },
        required: ["competitorA", "competitorB"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "storeCompetitorEvent",
      description: "Index a new competitor event into long-term Hindsight memory.",
      parameters: {
        type: "object",
        properties: {
          competitor: { type: "string", description: "Target competitor ID (e.g. novastack)" },
          date: { type: "string", description: "Event date (YYYY-MM-DD)" },
          category: { type: "string", description: "Event category (Pricing, Product, Feature, Hiring, Partnership, Marketing, Messaging, Strategy)" },
          title: { type: "string", description: "Concise event title" },
          description: { type: "string", description: "Detailed description of the competitor move" },
          source: { type: "string", description: "Signal URL or reference source" }
        },
        required: ["competitor", "title", "description"]
      }
    }
  }
];
