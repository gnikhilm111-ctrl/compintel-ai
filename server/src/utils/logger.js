/**
 * CompIntel AI - Server Logger Utility
 */

export const logger = {
  info: (msg, meta = {}) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? JSON.stringify(meta) : '');
  },
  warn: (msg, meta = {}) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, Object.keys(meta).length ? JSON.stringify(meta) : '');
  },
  error: (msg, error = {}) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, error?.stack || error);
  },
  agent: (agentName, msg, data = {}) => {
    console.log(`[AGENT:${agentName.toUpperCase()}] [${new Date().toISOString()}] ${msg}`, Object.keys(data).length ? JSON.stringify(data) : '');
  }
};
