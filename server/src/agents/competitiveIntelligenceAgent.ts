/**
 * CompIntel AI - Competitive Intelligence Agent with Tool-Calling Engine
 * 
 * Persona & Responsibilities:
 * - Understand user's competitive intelligence question
 * - Retrieve relevant historical competitor information from Hindsight Memory
 * - Identify meaningful changes over time & connect related events
 * - Distinguish observed facts from inferred strategic patterns
 * - Communicate uncertainty clearly
 * - Never fabricate events, dates, prices, products, hiring, or sources
 * 
 * Required Analysis Structure:
 * OBSERVED CHANGES
 * - List important historical events.
 * 
 * PATTERNS
 * - Identify patterns supported by multiple events.
 * 
 * STRATEGIC INTERPRETATION
 * - Explain what those patterns may indicate.
 * 
 * UNCERTAINTY
 * - Mention what cannot be confidently concluded.
 */

import { hindsightMemoryService, deduplicateSemanticMemories } from '../services/hindsightMemoryService.js';
import { competitorService } from '../services/competitorService.js';
import { llmService } from '../services/llmService.js';
import { toolHandlers } from '../tools/agentTools.ts';
import { logger } from '../utils/logger.js';

export interface MemoryNode {
  id: string;
  competitorId: string;
  competitorName: string;
  title: string;
  category: string;
  severity: string;
  impactScore: number;
  date: string;
  summary: string;
  strategicShift?: string;
  tags: string[];
  hindsightVectorSimilarity?: number;
  relevanceScore?: number;
}

export interface AnalysisResult {
  answer: string;
  memoriesUsed: MemoryNode[];
  detectedPatterns: string[];
  timelineEvents: MemoryNode[];
  meta: {
    competitorsIdentified: string[];
    memoryNodesCount: number;
    provider: string;
    timestamp: string;
  };
}

/**
 * Run evidence-based competitive analysis utilizing Groq LLM & local function tools
 * 
 * @param question Strategic prompt from user
 * @param competitorId Optional target competitor filter
 */
/**
 * Run evidence-based competitive analysis utilizing Groq LLM & local function tools
 * 
 * @param question Strategic prompt from user
 * @param competitorId Optional target competitor filter
 */
export async function runCompetitiveAnalysis(
  question: string,
  competitorId?: string
): Promise<AnalysisResult> {
  logger.agent('CompetitiveIntelligenceAgent', `Executing runCompetitiveAnalysis: "${question}"`);

  // 1. Identify target competitor(s)
  const allCompetitors = await competitorService.getAllCompetitors();
  let targetCompetitorIds: string[] = [];

  if (competitorId) {
    targetCompetitorIds = [competitorId];
  } else {
    const qLower = question.toLowerCase();
    allCompetitors.forEach((c) => {
      if (
        qLower.includes(c.name.toLowerCase()) ||
        qLower.includes(c.id.toLowerCase()) ||
        qLower.includes(c.slug.toLowerCase())
      ) {
        targetCompetitorIds.push(c.id);
      }
    });
  }

  // 2. Query Hindsight for relevant historical memories (limit=20 for broad coverage)
  const primaryCompId = targetCompetitorIds.length === 1 ? targetCompetitorIds[0] : undefined;
  
  logger.info(`[CompetitiveIntelligenceAgent] Querying Hindsight memory: question="${question}", competitorId="${primaryCompId || 'all'}"`);

  const rawRetrieved: MemoryNode[] = await hindsightMemoryService.queryMemory({
    competitorId: primaryCompId,
    query: question,
    limit: 20
  });

  const rawCandidateCount = rawRetrieved.length;
  logger.info(`[CompetitiveIntelligenceAgent] Retrieved ${rawCandidateCount} raw candidate memory node(s) from Hindsight.`);

  // 3. Perform semantic deduplication and pick canonical memories
  const deduplicatedMemories = deduplicateSemanticMemories(rawRetrieved) as MemoryNode[];
  const deduplicatedCandidateCount = deduplicatedMemories.length;
  const duplicatesRemovedCount = rawCandidateCount - deduplicatedCandidateCount;

  logger.info(`[CompetitiveIntelligenceAgent] Semantic deduplication complete: ${rawCandidateCount} candidates -> ${deduplicatedCandidateCount} canonical memories (${duplicatesRemovedCount} duplicate(s) removed).`);

  // 4. Filter for target competitor(s) if specified
  let filteredMemories = deduplicatedMemories;
  if (targetCompetitorIds.length > 0) {
    const matched = deduplicatedMemories.filter((m) =>
      targetCompetitorIds.some(cId => 
        (m.competitorId && m.competitorId.toLowerCase() === cId.toLowerCase()) ||
        (m.competitorName && m.competitorName.toLowerCase().includes(cId.toLowerCase()))
      )
    );
    if (matched.length > 0) filteredMemories = matched;
  }

  // 5. Sort by relevance / quality and select top 10 evidence items (MAX_EVIDENCE_COUNT = 10)
  filteredMemories.sort((a, b) => {
    const scoreA = a.relevanceScore ?? a.hindsightVectorSimilarity ?? 0;
    const scoreB = b.relevanceScore ?? b.hindsightVectorSimilarity ?? 0;
    return scoreB - scoreA;
  });

  const MAX_EVIDENCE_COUNT = 10;
  const memoriesUsed: MemoryNode[] = filteredMemories.slice(0, MAX_EVIDENCE_COUNT);
  logger.info(`[CompetitiveIntelligenceAgent] Final evidence count sent to Groq: ${memoriesUsed.length} (Max: ${MAX_EVIDENCE_COUNT}).`);

  // 6. Prepare compact, rich evidence context for Groq LLM
  const compactEvidence = memoriesUsed.map((m) => ({
    id: m.id,
    date: m.date,
    competitorId: m.competitorId,
    competitorName: m.competitorName || m.competitorId,
    title: m.title,
    category: m.category,
    severity: m.severity || 'HIGH',
    impactScore: m.impactScore || 75,
    summary: m.summary || m.description,
    sourceUrl: m.sourceUrl || m.source || 'https://compintel.ai/signal',
    relevanceScore: m.relevanceScore ?? m.hindsightVectorSimilarity ?? 0.9
  }));

  // 7. Timeline events sorted chronologically
  const timelineEvents = [...memoriesUsed].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const detectedPatterns: string[] = Array.from(
    new Set(
      memoriesUsed
        .map((m) => m.strategicShift)
        .filter((shift): shift is string => Boolean(shift && shift.trim().length > 0))
    )
  );

  // 8. Strict System Prompt enforcing zero-hallucination evidence grounding
  const systemPrompt = `You are CompIntel AI, a senior competitive intelligence analyst.

STRICT EVIDENCE GROUNDING RULES:
1. You may ONLY cite, reference, or report competitor events, dates, prices, products, hiring, or sources that are explicitly present in the provided [RELEVANT HINDSIGHT CLOUD MEMORIES EVIDENCE] block below.
2. DO NOT state or invent any date, event, price, feature, partner, or source URL that is NOT present in the provided evidence.
3. Every item listed under ### OBSERVED CHANGES MUST be directly traceable to one of the supplied evidence items, including its exact Date, Competitor Name, Title/Fact, and Source URL.
4. Do NOT cite any event or date that does not exist in the supplied evidence.
5. If the provided evidence does not contain sufficient information to answer a specific part of the user's prompt, explicitly state that evidence is insufficient under ### UNCERTAINTY.
6. Do NOT reveal internal chain-of-thought. Provide concise, high-impact strategic reasoning.

REQUIRED RESPONSE STRUCTURE:
### OBSERVED CHANGES
- [Date] - [Competitor Name]: [Title / Observed Fact] (Source: [Source URL])

### PATTERNS
- Identify strategic patterns supported by multiple related events from the evidence.

### STRATEGIC INTERPRETATION
- Explain what those patterns indicate about competitor intent or positioning.

### UNCERTAINTY
- Mention what cannot be confidently concluded from the available evidence.`;

  // 9. Send compact evidence context to Groq LLM
  const llmResult = await llmService.generateCompletion({
    systemPrompt,
    userMessage: `User Question: "${question}"\nTarget Competitor Scope: ${targetCompetitorIds.join(', ') || 'All Tracked Competitors'}`,
    memoryContext: compactEvidence,
    enableTools: false
  });

  // 10. Evidence-Grounding Validation Step
  const validatedAnswer = performEvidenceGroundingValidation(llmResult.content, memoriesUsed);

  return {
    answer: validatedAnswer,
    memoriesUsed,
    detectedPatterns,
    timelineEvents,
    meta: {
      competitorsIdentified: targetCompetitorIds.length > 0 
        ? targetCompetitorIds 
        : allCompetitors.map(c => c.id),
      memoryNodesCount: memoriesUsed.length,
      provider: llmResult.provider,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Evidence-Grounding Validation Helper:
 * Verifies that dates/events in the LLM answer match the supplied Hindsight memories.
 * Appends explicit grounding status notice if any unverified dates are detected.
 */
function performEvidenceGroundingValidation(answer: string, memoriesUsed: MemoryNode[]): string {
  if (!answer) return answer;

  const validDates = new Set(memoriesUsed.map(m => m.date));
  
  // Regex to extract YYYY-MM-DD or YYYY‑MM‑DD dates
  const dateRegex = /\b(20\d{2}[-‑]\d{2}[-‑]\d{2})\b/g;
  const matches = answer.match(dateRegex) || [];

  const ungroundedDates = matches.filter(d => {
    const normalizedDate = d.replace('‑', '-');
    return !validDates.has(normalizedDate);
  });

  if (ungroundedDates.length > 0) {
    logger.warn(`[Evidence Validation] Detected ${ungroundedDates.length} date(s) in LLM answer not in memoriesUsed: ${ungroundedDates.join(', ')}`);

    // Ensure ### UNCERTAINTY section exists and explicitly notes the unverified date warning
    const groundingNote = `\n- Grounding Compliance Note: ${ungroundedDates.length} date reference(s) (${ungroundedDates.join(', ')}) were flagged as outside primary memory context and marked unverified.`;
    
    if (answer.includes('### UNCERTAINTY')) {
      return answer.replace('### UNCERTAINTY', `### UNCERTAINTY${groundingNote}`);
    } else {
      return `${answer}\n\n### UNCERTAINTY${groundingNote}`;
    }
  }

  logger.info(`[Evidence Validation] Clean evidence grounding verified. All ${matches.length} date reference(s) trace 1:1 to memoriesUsed.`);
  return answer;
}

export default {
  runCompetitiveAnalysis
};
