import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Sparkles, Send, BrainCircuit, Database, Cpu, 
  Bot, User, ChevronRight, RefreshCw, Zap, ShieldAlert 
} from 'lucide-react';
import { api } from '../services/api';

export default function AIAnalyst() {
  const [searchParams] = useSearchParams();
  const targetCompetitor = searchParams.get('competitor') || '';

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'agent',
      text: `Hello! I am **CompIntel AI Strategy Analyst**. 

I have access to persistent **Hindsight long-term memory vectors** containing events, tech stack changes, and pricing moves across Nexus AI, HyperScale Systems, and Cognitive Ops.

How can I assist your competitive strategy team today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      memoryContext: []
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [includeMemory, setIncludeMemory] = useState(true);
  const [competitorFilter, setCompetitorFilter] = useState(targetCompetitor);
  const [competitors, setCompetitors] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    api.getCompetitors()
      .then(res => setCompetitors(res.data || []))
      .catch(err => console.error('Failed to load competitors:', err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const presetQueries = [
    "Compare pricing strategies between Nexus AI and HyperScale Systems.",
    "What are Cognitive Ops' main strategic vulnerabilities right now?",
    "Predict Nexus AI's product roadmap for Q1 2027 based on memory vectors.",
    "Generate an executive briefing on recent competitor patent filings."
  ];

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage({
        message: text,
        competitorId: competitorFilter || null,
        history: messages.map(m => ({ role: m.sender, content: m.text }))
      });

      const agentMsg = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: res.reply,
        provider: res.provider,
        memoryContext: res.memoryContext || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'agent',
        text: `⚠️ **Agent Execution Error**: ${err.message || 'Failed to generate strategic analysis.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>LLM Agent Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            CompIntel AI Strategy Analyst
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Interactive conversational agent leveraging Hindsight long-term memory to analyze competitor trajectory.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-semibold">Target Scope:</span>
            <select
              value={competitorFilter}
              onChange={(e) => setCompetitorFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none font-medium cursor-pointer"
            >
              <option value="" className="bg-slate-900">All Competitors</option>
              {competitors.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Chat Stream Window (3 Cols) */}
        <div className="lg:col-span-3 glass-panel rounded-2xl border border-slate-800 flex flex-col h-[650px] overflow-hidden">
          
          {/* Chat Messages Container */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                      : 'bg-slate-800 text-brand-300 border border-slate-700'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-600/90 text-white rounded-tr-none'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 text-[11px] opacity-75">
                    <span className="font-bold">
                      {msg.sender === 'user' ? 'Strategic Analyst' : 'CompIntel AI Agent'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-line">
                    {msg.text}
                  </div>

                  {/* Consulted Memory Nodes Pill */}
                  {msg.memoryContext?.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-brand-300">
                      <span className="font-bold block mb-1">
                        🧠 Hindsight Vector Memory Nodes Consulted ({msg.memoryContext.length}):
                      </span>
                      <div className="space-y-1">
                        {msg.memoryContext.map((m, idx) => (
                          <div key={idx} className="bg-slate-950/60 p-1.5 rounded border border-slate-800 text-slate-300 flex items-center justify-between">
                            <span className="truncate max-w-md"><strong>{m.competitorName}:</strong> {m.title}</span>
                            <span className="text-brand-400 font-mono text-[10px]">Sim: {((m.relevanceScore || m.hindsightVectorSimilarity || 0.9) * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.provider && (
                    <div className="mt-2 text-[10px] text-slate-500 font-mono">
                      Engine: {msg.provider}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <div className="p-2 rounded-xl bg-slate-800 text-brand-400 animate-spin">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <span>CompIntel Strategy Agent is searching Hindsight vectors & reasoning...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-3"
            >
              <input
                type="text"
                placeholder="Ask about competitor strategies, pricing cuts, leadership moves, or predictions..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={loading}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />

              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-brand-600/30 disabled:opacity-50 transition-all shrink-0"
              >
                <span>Analyze</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Preset Prompt Suggestions Sidebar (1 Col) */}
        <div className="space-y-4">
          
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-white mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Suggested Strategy Prompts</span>
            </div>

            <div className="space-y-2">
              {presetQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(query)}
                  disabled={loading}
                  className="w-full text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-brand-500/40 text-xs text-slate-300 hover:text-white transition-all flex items-start justify-between group"
                >
                  <span className="leading-normal">{query}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 shrink-0 mt-0.5 ml-1" />
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-300">
              <BrainCircuit className="w-4 h-4" />
              <span>Hindsight Vector Context</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When memory recall is enabled, the agent fetches relevant historical competitor nodes from Hindsight long-term storage to ground its strategic output.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
