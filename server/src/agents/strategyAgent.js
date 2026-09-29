/**
 * CompIntel AI - Strategy Agent
 * 
 * Specializes in macro-level competitive strategy analysis, threat evaluation,
 * trajectory comparison, and generating executive counter-strategy recommendations.
 */

import { llmService } from '../services/llmService.js';
import { hindsightMemoryService } from '../services/hindsightMemoryService.js';
import { competitorService } from '../services/competitorService.js';
import { logger } from '../utils/logger.js';

export const strategyAgent = {
  /**
   * Run deep competitive strategy analysis
   */
  analyzeStrategy: async ({ query, competitorId = null, includeMemory = true }) => {
    logger.agent('StrategyAgent', `Running strategy evaluation for query: "${query}"`);

    // Fetch memory context
    let memoryContext = [];
    if (includeMemory) {
      memoryContext = await hindsightMemoryService.queryMemory({
        query,
        competitorId,
        limit: 8
      });
    }

    // Fetch competitor overview if specified
    let competitorInfo = null;
    if (competitorId) {
      competitorInfo = await competitorService.getCompetitorById(competitorId);
    }

    const systemPrompt = `You are CompIntel AI's Strategy Agent. You specialize in analyzing competitive dynamics, pricing moves, tech stack evolutions, M&A activities, and executive hiring. Use the provided Hindsight long-term memory vectors to craft structured, highly actionable strategic advice. Always include clear sections, threat scores, and specific counter-measures.`;

    const userMessage = competitorInfo 
      ? `Analyze the strategic trajectory of ${competitorInfo.name} (${competitorInfo.category}). Current query/focus: ${query}`
      : `Provide a strategic comparison and competitive threat analysis for: ${query}`;

    const llmResult = await llmService.generateCompletion({
      systemPrompt,
      userMessage,
      memoryContext,
      competitorData: competitorInfo
    });

    return {
      agent: "StrategyAgent",
      timestamp: new Date().toISOString(),
      query,
      competitorId,
      memoryNodesConsulted: memoryContext.length,
      analysis: llmResult.content,
      provider: llmResult.provider
    };
  }
};
