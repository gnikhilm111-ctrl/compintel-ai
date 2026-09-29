/**
 * CompIntel AI - Frontend API Service Client
 */

const API_BASE = '/api';

async function fetchJSON(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${url}:`, err);
    throw err;
  }
}

export const api = {
  // GET /api/competitors
  getCompetitors: async () => {
    return fetchJSON(`${API_BASE}/competitors`);
  },

  // GET /api/competitors/:id
  getCompetitorById: async (id) => {
    return fetchJSON(`${API_BASE}/competitors/${id}`);
  },

  // GET /api/competitors/:id/events
  getCompetitorEvents: async (id) => {
    return fetchJSON(`${API_BASE}/competitors/${id}/events`);
  },

  // POST /api/competitors/:id/research (Live Competitor Research Workflow)
  runLiveResearch: async (competitorId, topic = '') => {
    return fetchJSON(`${API_BASE}/competitors/${competitorId}/research`, {
      method: 'POST',
      body: JSON.stringify({ topic })
    });
  },

  // GET /api/events
  getEvents: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.query) params.append('query', filters.query);
    if (filters.competitorId) params.append('competitorId', filters.competitorId);
    if (filters.category) params.append('category', filters.category);
    if (filters.limit) params.append('limit', filters.limit);

    const queryString = params.toString();
    return fetchJSON(`${API_BASE}/events${queryString ? `?${queryString}` : ''}`);
  },

  // POST /api/events
  createEvent: async (eventData) => {
    return fetchJSON(`${API_BASE}/events`, {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  },

  // POST /api/chat
  sendChatMessage: async ({ message, competitorId, history, category }) => {
    return fetchJSON(`${API_BASE}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message, competitorId, history, category })
    });
  },

  // GET /api/stats
  getDashboardStats: async () => {
    return fetchJSON(`${API_BASE}/stats`);
  },

  // POST /api/analysis/strategy
  getStrategyAnalysis: async ({ query, competitorId }) => {
    return fetchJSON(`${API_BASE}/analysis/strategy`, {
      method: 'POST',
      body: JSON.stringify({ query, competitorId })
    });
  },

  // GET /api/health
  getHealthStatus: async () => {
    return fetchJSON(`${API_BASE}/health`);
  }
};
