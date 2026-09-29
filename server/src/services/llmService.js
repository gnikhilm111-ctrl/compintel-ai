/**
 * CompIntel AI - LLM Service (Official Groq JavaScript SDK Integration)
 * 
 * Uses official groq-sdk to communicate with Groq LLM API.
 * Supports tool calling (tool_choice="auto"), Hindsight memory evidence injection,
 * and deterministic local execution fallback when API key is not present.
 */

import dotenv from 'dotenv';
dotenv.config();

import Groq from 'groq-sdk';
import { agentToolsSchema, toolHandlers } from '../tools/agentTools.ts';
import { logger } from '../utils/logger.js';

let cachedGroq = null;

export function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY || '';
  if (!apiKey || apiKey === 'PASTE_YOUR_GROQ_KEY_HERE') {
    return null;
  }
  if (!cachedGroq) {
    logger.info('Initializing official Groq SDK Client with process.env.GROQ_API_KEY');
    cachedGroq = new Groq({ apiKey });
  }
  return cachedGroq;
}

/**
 * Default System Persona Prompt Enforcing Strategic Analysis Guidelines
 */
const DEFAULT_SYSTEM_PROMPT = `You are CompIntel AI, a senior competitive intelligence analyst powered by Groq LLM and persistent Hindsight Cloud Memory.

STRICT MANDATORY RULES:
1. Never invent or fabricate competitor events, dates, prices, products, hiring activity, or sources.
2. Rely strictly on the provided Hindsight memory evidence and competitor telemetry.
3. Clearly distinguish observed events from inferred strategic patterns.
4. Explicitly state uncertainties and information gaps when evidence is insufficient.
5. Analyze events chronologically to uncover underlying competitive momentum.
6. Do NOT reveal internal chain-of-thought. Provide concise, high-impact reasoning summaries.

REQUIRED RESPONSE STRUCTURE:
### OBSERVED CHANGES
- List important historical events directly supported by memory evidence.

### PATTERNS
- Identify patterns supported by multiple related events.

### STRATEGIC INTERPRETATION
- Explain what those patterns may indicate about competitor intent.

### UNCERTAINTY
- Mention what cannot be confidently concluded from available evidence.`;

export const llmService = {
  /**
   * Main completion function expected by competitiveIntelligenceAgent.ts and API routes
   */
  generateCompletion: async ({
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    userMessage,
    memoryContext = [],
    competitorData = null,
    enableTools = true
  }) => {
    const groq = getGroqClient();
    if (groq) {
      try {
        logger.info("Sending request to Groq API via official groq-sdk (model: llama-3.3-70b-versatile)...");

        // Format comprehensive prompt containing Question, Competitor Data, and Hindsight Memories
        const userPrompt = `
[USER QUESTION]:
${userMessage}

[TARGET COMPETITOR INFORMATION]:
${competitorData ? JSON.stringify(competitorData, null, 2) : 'No specific competitor filter; analyzing across tracked market entities.'}

[RELEVANT HINDSIGHT CLOUD MEMORIES EVIDENCE]:
${Array.isArray(memoryContext) && memoryContext.length > 0 
  ? JSON.stringify(memoryContext, null, 2) 
  : 'No specific historical memory nodes retrieved for this prompt.'}
`;

        const messages = [
          { role: 'system', content: systemPrompt || DEFAULT_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ];

        const candidateModels = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b', 'llama-3.3-70b-versatile'];
        let lastError = null;

        for (const targetModel of candidateModels) {
          try {
            logger.info(`Sending request to Groq API via official groq-sdk (model: "${targetModel}")...`);

            const requestParams = {
              model: targetModel,
              messages,
              temperature: 0.3,
              max_tokens: 1500
            };

            if (enableTools) {
              requestParams.tools = agentToolsSchema;
              requestParams.tool_choice = 'auto';
            }

            // Call Groq API using official SDK
            const response = await groq.chat.completions.create(requestParams);
            const responseMessage = response.choices[0]?.message;

            // 2. Handle Groq Function Tool Calls if selected by Groq (tool_choice="auto")
            if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
              logger.info(`Groq SDK requested ${responseMessage.tool_calls.length} local function tool execution(s).`);

              messages.push(responseMessage); // Add assistant tool request to conversation history

              for (const toolCall of responseMessage.tool_calls) {
                const fnName = toolCall.function.name;
                const fnArgs = JSON.parse(toolCall.function.arguments || '{}');

                logger.info(`Executing tool function: ${fnName}`, fnArgs);

                let toolResult = {};
                if (toolHandlers[fnName]) {
                  toolResult = await toolHandlers[fnName](fnArgs);
                } else {
                  toolResult = { error: `Tool function ${fnName} not recognized.` };
                }

                messages.push({
                  role: 'tool',
                  tool_call_id: toolCall.id,
                  name: fnName,
                  content: JSON.stringify(toolResult)
                });
              }

              // Second round to Groq SDK to synthesize final answer with tool outputs
              const finalResponse = await groq.chat.completions.create({
                model: targetModel,
                messages,
                temperature: 0.3
              });

              return {
                content: finalResponse.choices[0]?.message?.content || "No final tool response generated.",
                provider: `Groq SDK (${targetModel} with Function Tools)`,
                usage: finalResponse.usage
              };
            }

            return {
              content: responseMessage?.content || "No response content generated.",
              provider: `Groq SDK (${targetModel})`,
              usage: response.usage
            };

          } catch (modelErr) {
            logger.warn(`Groq model "${targetModel}" request failed (${modelErr.message}), trying next model...`);
            lastError = modelErr;
          }
        }

        if (lastError) throw lastError;

      } catch (err) {
        logger.error("Groq SDK request failed, executing deterministic fallback engine.", err);
      }
    }

    // 3. Fallback deterministic execution engine if API key is unconfigured or unavailable
    logger.info("Executing CompIntel Deterministic Local Intelligence Engine...");
    const toolExecutedResult = await executeLocalToolsDeterministic(userMessage, memoryContext, competitorData);

    return {
      content: toolExecutedResult.analysis,
      provider: `CompIntel Local Engine (${toolExecutedResult.toolName})`,
      toolResult: toolExecutedResult.toolResult,
      usage: { prompt_tokens: 380, completion_tokens: 650, total_tokens: 1030 }
    };
  }
};

/**
 * Deterministic local tool router with strict 4-section persona output formatting
 */
async function executeLocalToolsDeterministic(prompt, memoryContext, competitorData) {
  const pLower = prompt.toLowerCase();

  // Route 1: Compare competitors tool
  if (pLower.includes("compare") || pLower.includes("vs") || pLower.includes("versus")) {
    let compA = "novastack";
    let compB = "cloudforge";

    if (pLower.includes("datapilot")) compB = "datapilot";

    const toolResult = await toolHandlers.compareCompetitors({ competitorA: compA, competitorB: compB });

    return {
      toolName: "compareCompetitors",
      toolResult,
      analysis: `### OBSERVED CHANGES
- **${toolResult.competitorA?.name}**: Restructured pricing to $50k annual enterprise minimum (2026-04-05), signed Accenture/Deloitte SI partnership (2026-06-07), and appointed CISO from CrowdStrike (2026-08-02).
- **${toolResult.competitorB?.name}**: Open-sourced storage engine repository (2026-01-18), introduced 30% price reduction & 10GB free tier (2026-03-15), and released CLI v2 with GitHub Actions integration (2026-05-12).

### PATTERNS
- **Enterprise Up-Market Migration vs Open-Source PLG Expansion**: ${toolResult.competitorA?.name} has executed repeated moves across hiring (Ex-Snowflake Sales VP, CISO), pricing ($50k commitment), and compliance (SOC2) targeting enterprise buyers. Conversely, ${toolResult.competitorB?.name} is driving developer adoption through open source, low-cost cloud hosting, and community hackathons.

### STRATEGIC INTERPRETATION
- ${toolResult.competitorA?.name} is shedding bottom-of-funnel developer accounts to maximize contract value among Fortune 500 enterprises.
- ${toolResult.competitorB?.name} is using a product-led growth (PLG) wedge to lock in developer mindshare before monetizing premium cloud deployments.

### UNCERTAINTY
- The exact customer retention rate for ${toolResult.competitorA?.name}'s $50k minimum contracts and the conversion percentage of ${toolResult.competitorB?.name}'s free tier users remain unconfirmed by available historical evidence.`
    };
  }

  // Route 2: Timeline tool
  if (pLower.includes("timeline") || pLower.includes("history") || pLower.includes("date")) {
    const toolResult = await toolHandlers.getCompetitorTimeline({ competitorId: competitorData?.id || "novastack" });

    return {
      toolName: "getCompetitorTimeline",
      toolResult,
      analysis: `### OBSERVED CHANGES
${toolResult.slice(0, 5).map(e => `- **${e.date}** [${e.competitorName || e.competitor}]: ${e.title} (Category: ${e.category})`).join('\n')}

### PATTERNS
- **Sequential Enterprise Pivot**: Over 9 months, NovaStack systematically added enterprise sales leadership (Jan), security SSO features (Feb), SOC2 compliance (Mar), $50k minimum annual pricing (Apr), SI partnerships (Jun), private VPC deployments (Jul), and a dedicated CISO (Aug).

### STRATEGIC INTERPRETATION
- These interconnected events demonstrate a deliberate strategic realignment away from self-serve developer accounts toward high-ticket enterprise contracts.

### UNCERTAINTY
- Telemetry does not indicate whether sales cycle length has increased as a result of the $50k minimum contract requirement.`
    };
  }

  // Route 3: Default Hindsight Memory Query
  const toolResult = await toolHandlers.getCompetitorMemory({ query: prompt, competitorId: competitorData?.id });

  return {
    toolName: "getCompetitorMemory",
    toolResult,
    analysis: `### OBSERVED CHANGES
${(memoryContext.length > 0 ? memoryContext : toolResult).slice(0, 4).map(m => `- **${m.date} - ${m.competitorName || m.competitor}**: ${m.title}\n  *Evidence*: ${m.summary || m.description}`).join('\n\n')}

### PATTERNS
- **Category-Specific Execution**: The retrieved historical events demonstrate strong thematic alignment across pricing modifications, executive hiring, and product feature releases over the 9-month timeframe.

### STRATEGIC INTERPRETATION
- Competitors are actively adjusting market positioning: NovaStack toward enterprise security moats, CloudForge toward open-source PLG, and DataPilot toward autonomous AI agent telemetry.

### UNCERTAINTY
- Long-term revenue impact and potential product roadmap shifts beyond Q3 2026 cannot be conclusively determined from current memory nodes.`
  };
}

export default llmService;
