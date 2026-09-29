import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Database, AlertOctagon, TrendingUp, Sparkles, 
  ArrowRight, ShieldAlert, Cpu, RefreshCw, Layers, Plus 
} from 'lucide-react';
import { api } from '../services/api';
import CompetitorCard from '../components/CompetitorCard';
import EventCard from '../components/EventCard';
import NewEventModal from '../components/NewEventModal';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickAIAnalysis, setQuickAIAnalysis] = useState(null);
  const [analyzingAI, setAnalyzingAI] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, compRes, eventsRes] = await Promise.all([
        api.getDashboardStats(),
        api.getCompetitors(),
        api.getEvents({ limit: 4 })
      ]);

      setStats(statsRes.data);
      setCompetitors(compRes.data || []);
      setRecentEvents(eventsRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerateAISummary = async () => {
    setAnalyzingAI(true);
    try {
      const res = await api.getStrategyAnalysis({
        query: 'Summarize top market shifts and threat vectors across tracked competitors.'
      });
      setQuickAIAnalysis(res.data?.analysis || 'No analysis generated.');
    } catch (err) {
      console.error('Failed to run AI summary:', err);
    } finally {
      setAnalyzingAI(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Hero / Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Autonomous Intelligence Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Competitive Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Persistent Hindsight memory tracking competitor moves, pricing shifts, and strategic trajectory.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Index Event Node</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tracked Competitors */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Tracked Competitors</span>
            <div className="text-2xl font-black text-white">
              {stats?.totalCompetitors || 3}
            </div>
            <span className="text-[11px] text-slate-500">Active Market Entities</span>
          </div>
        </div>

        {/* Hindsight Memory Nodes */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Memory Nodes Indexed</span>
            <div className="text-2xl font-black text-white">
              {stats?.totalMemoryEvents || 7}
            </div>
            <span className="text-[11px] text-brand-400">Persistent Vector Store</span>
          </div>
        </div>

        {/* Critical Threats */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 glow-critical">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Critical Threat Events</span>
            <div className="text-2xl font-black text-rose-400">
              {stats?.criticalThreatsCount || 2}
            </div>
            <span className="text-[11px] text-rose-500/80">Requires Immediate Counter</span>
          </div>
        </div>

        {/* Market Threat Index */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Avg Threat Index</span>
            <div className="text-2xl font-black text-white">
              {stats?.averageThreatScore || 78}/100
            </div>
            <span className="text-[11px] text-emerald-400">AI Confidence: {stats?.aiConfidenceScore || 94.8}%</span>
          </div>
        </div>

      </div>

      {/* AI Quick Insight Briefing Section */}
      <div className="glass-panel rounded-2xl p-6 border border-brand-500/30 relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-brand-500/20 text-brand-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Hindsight AI Strategic Briefing
              </h3>
              <p className="text-xs text-slate-400">
                Automated synthesis of competitor vector trajectories over the last 30 days.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateAISummary}
            disabled={analyzingAI}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 text-xs font-semibold border border-brand-500/30 transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{analyzingAI ? 'Synthesizing...' : 'Run Strategy Agent Analysis'}</span>
          </button>
        </div>

        {quickAIAnalysis ? (
          <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-300 bg-slate-950/80 p-4 rounded-xl border border-slate-800 whitespace-pre-line">
            {quickAIAnalysis}
          </div>
        ) : (
          <div className="text-xs text-slate-400 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <span>
              💡 <strong>Market Snapshot:</strong> Competitors are executing price adjustments (-25% token cuts at Nexus AI) and open-sourcing PLG SDKs (Cognitive Ops) to accelerate developer adoption.
            </span>
            <button
              onClick={handleGenerateAISummary}
              className="text-brand-400 underline font-semibold ml-2 hover:text-brand-300"
            >
              Generate Deep Report
            </button>
          </div>
        )}
      </div>

      {/* Tracked Competitors Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Tracked Market Competitors</h2>
            <p className="text-xs text-slate-400">Live profiling & memory density stats</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {competitors.map((comp) => (
            <CompetitorCard key={comp.id} competitor={comp} />
          ))}
        </div>
      </div>

      {/* Recent Hindsight Event Stream */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Recent Hindsight Memory Stream</h2>
            <p className="text-xs text-slate-400">Real-time indexed market signals & strategic shifts</p>
          </div>

          <Link
            to="/timeline"
            className="flex items-center space-x-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <span>View Full Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </div>

      {/* Modal for adding new event */}
      <NewEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        competitors={competitors}
        onEventAdded={(newEvent) => {
          setRecentEvents([newEvent, ...recentEvents.slice(0, 3)]);
          loadData();
        }}
      />

    </div>
  );
}
