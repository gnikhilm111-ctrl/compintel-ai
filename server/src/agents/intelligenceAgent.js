/**
 * CompIntel AI - Intelligence Agent
 * 
 * Specializes in processing raw market signals, summarizing event impacts,
 * generating memory tags, and serving conversational intelligence requests.
 */

import { llmService } from '../services/llmService.js';
import { hindsightMemoryService } from '../services/hindsightMemoryService.js';
import { logger } from '../utils/logger.js';

export const intelligenceAgent = {
  /**
   * Process interactive chat requests from the AI Analyst UI
   */
  processChat: async ({ message, history = [], competitorId = null, filterCategory = null }) => {
    logger.agent('IntelligenceAgent', `Processing chat request: "${message}"`);

    // Fetch relevant memory from Hindsight
    const memoryContext = await hindsightMemoryService.queryMemory({
      query: message,
      competitorId,
      category: filterCategory,
      limit: 6
    });

    const systemPrompt = `You are CompIntel AI, a state-of-the-art competitive intelligence analyst bot with access to persistent Hindsight long-term memory of competitor events.
Your task is to answer user queries with precise market intelligence, highlight relevant event data, assess risk levels, and provide clear strategic recommendations. Be concise, professional, and visually structured with markdown.`;

    const llmResult = await llmService.generateCompletion({
      systemPrompt,
      userMessage: message,
      memoryContext
    });

    return {
      reply: llmResult.content,
      agent: "IntelligenceAgent",
      memoryContext,
      provider: llmResult.provider
    };
  }
};
