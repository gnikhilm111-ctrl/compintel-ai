import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, ShieldAlert, Cpu, Layers, TrendingUp, 
  MapPin, Users, DollarSign, Calendar, Sparkles, Database,
  ArrowLeft, ExternalLink, Zap, Globe, RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import EventCard from '../components/EventCard';

export default function CompetitorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [competitor, setCompetitor] = useState(null);
  const [competitorsList, setCompetitorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // AI Battle Card state
  const [aiReport, setAiReport] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Live Research state
  const [researching, setResearching] = useState(false);
  const [researchResult, setResearchResult] = useState(null);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [compRes, allComps] = await Promise.all([
        api.getCompetitorById(id || 'novastack'),
        api.getCompetitors()
      ]);
      setCompetitor(compRes.data);
      setCompetitorsList(allComps.data || []);
    } catch (err) {
      console.error('Failed to fetch competitor details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const handleGenerateBattleCard = async () => {
    if (!competitor) return;
    setGeneratingReport(true);
    try {
      const res = await api.getStrategyAnalysis({
        query: `Generate executive competitive battle card and counter-tactics for ${competitor.name}`,
        competitorId: competitor.id
      });
      setAiReport(res.data?.analysis);
    } catch (err) {
      console.error('Failed to generate battle card:', err);
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleRunLiveResearch = async () => {
    if (!competitor) return;
    setResearching(true);
    setResearchResult(null);
    try {
      const res = await api.runLiveResearch(competitor.id);
      setResearchResult(res.data);
      // Refresh profile data to incorporate new events
      await fetchProfileData();
    } catch (err) {
      console.error('Failed to execute live research:', err);
    } finally {
      setResearching(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-3" />
        <p className="text-xs font-semibold">Retrieving Competitor Hindsight Memory Vectors...</p>
      </div>
    );
  }

  if (!competitor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Competitor Profile Not Found</h2>
        <p className="text-slate-400 text-xs mb-4">No data indexed for competitor ID '{id}'.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Selector & Back Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        {/* Competitor Target Switcher */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold px-2">Switch Target:</span>
          {competitorsList.map(c => (
            <Link
              key={c.id}
              to={`/competitors/${c.id}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                c.id === competitor.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Profile Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                {competitor.category}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Threat Index: {competitor.threatScore}/100 ({competitor.threatLevel})
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {competitor.name}
            </h1>

            <p className="text-base text-slate-300 font-medium">
              {competitor.tagline}
            </p>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {competitor.description}
            </p>

            {/* Quick Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                {competitor.headquarters}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-400" />
                {competitor.employees} Employees
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-brand-400" />
                {competitor.funding}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-400" />
                Founded {competitor.founded}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 flex flex-col space-y-3">
            
            {/* Run Live Research Button */}
            <button
              onClick={handleRunLiveResearch}
              disabled={researching}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-xl shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5"
            >
              <Globe className={`w-4 h-4 ${researching ? 'animate-spin' : ''}`} />
              <span>{researching ? 'Agent Researching Web...' : 'Run Live Web Research'}</span>
            </button>

            {/* Generate Battle Card */}
            <button
              onClick={handleGenerateBattleCard}
              disabled={generatingReport}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-xl shadow-brand-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generatingReport ? 'Generating...' : 'Generate Executive Battle Card'}</span>
            </button>

          </div>

        </div>
      </div>

      {/* Live Research Results Feedback Card */}
      {researchResult && (
        <div className="glass-panel rounded-2xl p-6 border border-emerald-500/40 bg-slate-950">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Live Web Research Completed for {researchResult.searchedCompetitor}
                </h3>
                <p className="text-xs text-slate-400">
                  Extracted structured events, verified source URLs, and indexed new signals into Hindsight Memory.
                </p>
              </div>
            </div>
            
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              +{researchResult.newEventsIndexed} New Events Indexed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block font-medium">New Events Indexed:</span>
              <span className="text-base font-bold text-emerald-400">{researchResult.newEventsIndexed}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block font-medium">Duplicates Prevented:</span>
              <span className="text-base font-bold text-slate-300">{researchResult.skippedDuplicatesCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Generated Battle Card Output */}
      {aiReport && (
        <div className="glass-panel rounded-2xl p-6 border border-brand-500/40 bg-slate-950">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">
              AI Competitive Battle Card ({competitor.name})
            </h3>
          </div>
          <div className="prose prose-invert max-w-none text-xs leading-relaxed text-slate-300 bg-slate-900/80 p-5 rounded-xl border border-slate-800 whitespace-pre-line">
            {aiReport}
          </div>
        </div>
      )}

      {/* Tech Stack & Key Strategy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">Tech Stack & Infrastructure</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {competitor.techStack?.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-semibold border border-slate-800"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Strategic Focus Pillars</h3>
          </div>

          <ul className="space-y-2">
            {competitor.strategicFocus?.map((pillar, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0 mt-1.5" />
                <span>{pillar}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Competitor Specific Event Memory Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">
              Hindsight Memory Stream for {competitor.name}
            </h3>
            <p className="text-xs text-slate-400">
              Chronological timeline of indexed strategic events ({competitor.events?.length || 0} memory nodes)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {competitor.events?.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      </div>

    </div>
  );
}
