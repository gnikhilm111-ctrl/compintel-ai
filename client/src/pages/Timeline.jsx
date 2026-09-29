import React, { useEffect, useState } from 'react';
import { 
  Search, Calendar, Database, Plus, RefreshCw, 
  Sparkles, DollarSign, Cpu, Wrench, UserPlus, Handshake, 
  Megaphone, MessageSquare, Compass, ShieldAlert, CheckCircle2,
  BrainCircuit, ExternalLink, X, ChevronRight, Filter
} from 'lucide-react';
import { api } from '../services/api';
import NewEventModal from '../components/NewEventModal';

export default function Timeline() {
  const [events, setEvents] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCompetitor, setSelectedCompetitor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { name: 'Pricing', icon: DollarSign, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' },
    { name: 'Product', icon: Cpu, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-800' },
    { name: 'Feature', icon: Wrench, color: 'text-sky-400 bg-sky-950/60 border-sky-800' },
    { name: 'Hiring', icon: UserPlus, color: 'text-amber-400 bg-amber-950/60 border-amber-800' },
    { name: 'Partnership', icon: Handshake, color: 'text-purple-400 bg-purple-950/60 border-purple-800' },
    { name: 'Marketing', icon: Megaphone, color: 'text-rose-400 bg-rose-950/60 border-rose-800' },
    { name: 'Messaging', icon: MessageSquare, color: 'text-pink-400 bg-pink-950/60 border-pink-800' },
    { name: 'Strategy', icon: Compass, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800' },
  ];

  const getCategoryMeta = (catName) => {
    const found = categories.find(c => c.name.toLowerCase() === catName?.toLowerCase());
    return found || { name: catName || 'General', icon: Compass, color: 'text-slate-300 bg-slate-900 border-slate-800' };
  };

  const fetchTimelineData = async () => {
    setLoading(true);
    try {
      const [eventsRes, compRes] = await Promise.all([
        api.getEvents({
          query: searchQuery,
          competitorId: selectedCompetitor,
          category: selectedCategory
        }),
        api.getCompetitors()
      ]);

      let resultEvents = eventsRes.data || [];

      // Filter by start and end dates locally if specified
      if (startDate) {
        resultEvents = resultEvents.filter(e => new Date(e.date) >= new Date(startDate));
      }
      if (endDate) {
        resultEvents = resultEvents.filter(e => new Date(e.date) <= new Date(endDate));
      }

      // Sort chronologically ascending for timeline flow
      resultEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setEvents(resultEvents);
      setCompetitors(compRes.data || []);
    } catch (err) {
      console.error('Failed to fetch timeline data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimelineData();
  }, [selectedCompetitor, selectedCategory, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTimelineData();
  };

  // Trigger AI Analysis for selected competitor and time range
  const handleRunAIAnalysis = async () => {
    setAnalyzing(true);
    setShowAnalysisPanel(true);
    try {
      const targetCompName = competitors.find(c => c.id === selectedCompetitor)?.name || selectedCompetitor || 'all competitors';
      const dateRangeStr = startDate || endDate ? `between ${startDate || 'earliest'} and ${endDate || 'latest'}` : 'over the 9-month timeframe';

      const prompt = `Analyze strategic evolution for ${targetCompName} ${dateRangeStr} based on retrieved Hindsight memories.`;

      const res = await api.sendChatMessage({
        message: prompt,
        competitorId: selectedCompetitor || null
      });

      setAiAnalysis({
        reply: res.reply,
        memoriesUsed: res.memoriesUsed || [],
        provider: res.provider
      });
    } catch (err) {
      console.error('Failed to run AI analysis:', err);
      setAiAnalysis({
        reply: `⚠️ Error generating AI analysis: ${err.message}`
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-400 uppercase tracking-widest mb-1">
            <Database className="w-4 h-4" />
            <span>Persistent Chronological Memory Stream</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Competitor Events Timeline
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track historical event patterns, pricing pivots, hiring waves, and product releases across time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRunAIAnalysis}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Strategic Evolution Analysis</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Index Event Node</span>
          </button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
        
        {/* Search Bar & Primary Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Competitor Selector */}
          <div>
            <select
              value={selectedCompetitor}
              onChange={(e) => setSelectedCompetitor(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Competitors (NovaStack, CloudForge, DataPilot)</option>
              {competitors.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.category})</option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="">All Event Categories</option>
              {categories.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Date Filter & Category Quick Chips */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs">
          
          {/* Date Range Inputs */}
          <div className="flex items-center space-x-2 text-slate-300 font-medium">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Time Range:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-brand-400 hover:text-brand-300 text-[11px] underline ml-1"
              >
                Clear Dates
              </button>
            )}
          </div>

          {/* Quick Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(isSelected ? '' : cat.name)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

        </div>

      </div>

      {/* AI Analysis Panel Output */}
      {showAnalysisPanel && (
        <div className="glass-panel rounded-2xl p-6 border border-brand-500/40 bg-slate-950/90 relative shadow-2xl">
          <button
            onClick={() => setShowAnalysisPanel(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                CompIntel AI Strategic Evolution Analysis
              </h3>
              <p className="text-xs text-slate-400">
                Evidence-based report generated from Hindsight memory vectors
              </p>
            </div>
          </div>

          {analyzing ? (
            <div className="py-8 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-300">
                Retrieving Hindsight memory nodes & synthesizing strategic trajectory patterns...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-200 bg-slate-900/90 p-5 rounded-xl border border-slate-800 whitespace-pre-line">
                {aiAnalysis?.reply}
              </div>

              {aiAnalysis?.provider && (
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-900">
                  <span>Engine: {aiAnalysis.provider}</span>
                  <span>Hindsight Nodes Consulted: {aiAnalysis.memoriesUsed?.length || 0}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Timeline View */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto" />
          <p className="text-xs font-semibold">Querying Hindsight Memory Vectors...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Database className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No Historical Events Found</h3>
          <p className="text-xs text-slate-500">No events matched the selected competitor or date criteria.</p>
        </div>
      ) : (
        <div className="relative pl-4 sm:pl-8 border-l-2 border-slate-800 space-y-8 my-4">
          {events.map((evt, idx) => {
            const catMeta = getCategoryMeta(evt.category);
            const CategoryIcon = catMeta.icon;

            return (
              <div key={evt.id || idx} className="relative group">
                
                {/* Node Icon Circle on Timeline Spine */}
                <div className={`absolute -left-[25px] sm:-left-[41px] top-1.5 p-2 rounded-full border shadow-lg ${catMeta.color}`}>
                  <CategoryIcon className="w-4 h-4" />
                </div>

                {/* Event Card Panel */}
                <div className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-brand-500/40 transition-colors space-y-3">
                  
                  {/* Top Card Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {/* Competitor Pill */}
                      <span className="font-bold text-xs text-brand-300 bg-brand-950 px-2.5 py-1 rounded-md border border-brand-800/60">
                        {evt.competitorName || evt.competitor}
                      </span>

                      {/* Category Badge */}
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center space-x-1 ${catMeta.color}`}>
                        <CategoryIcon className="w-3 h-3" />
                        <span>{evt.category}</span>
                      </span>

                      {/* Severity Pill */}
                      {evt.severity && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          evt.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                          evt.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                          'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {evt.severity}
                        </span>
                      )}
                    </div>

                    {/* Hindsight Memory Stored Indicator */}
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-mono text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Stored in Hindsight Memory</span>
                      </span>

                      <span className="text-slate-400 font-mono text-xs">
                        {evt.date}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                    {evt.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {evt.description || evt.summary}
                  </p>

                  {/* Footer Meta & Source */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {evt.tags?.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {evt.source && (
                      <a
                        href={evt.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-slate-400 hover:text-brand-300 transition-colors text-[11px]"
                      >
                        <span>Source Signal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Index Custom Event Modal */}
      <NewEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        competitors={competitors}
        onEventAdded={(newEvent) => {
          setEvents([...events, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        }}
      />

    </div>
  );
}
