import React from 'react';
import { Tag, ExternalLink, BrainCircuit, Calendar, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function EventCard({ event }) {
  const {
    id,
    competitorName,
    title,
    category,
    severity,
    impactScore,
    date,
    summary,
    strategicShift,
    tags = [],
    sourceUrl,
    hindsightVectorSimilarity,
    aiAnalysisNote
  } = event;

  const getSeverityBadge = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800 relative group overflow-hidden">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm text-brand-300 bg-brand-950/60 px-2.5 py-0.5 rounded-md border border-brand-800/50">
            {competitorName}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {category}
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(severity)}`}>
            {severity} ({impactScore}/100)
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{date}</span>
          </span>

          {hindsightVectorSimilarity && (
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60" title="Hindsight Long-Term Memory Semantic Similarity Score">
              <BrainCircuit className="w-3.5 h-3.5 text-brand-400" />
              <span>Sim: {(hindsightVectorSimilarity * 100).toFixed(0)}%</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Event Title */}
      <h4 className="text-base font-bold text-white mb-2 group-hover:text-brand-200 transition-colors">
        {title}
      </h4>

      {/* Summary Content */}
      <p className="text-sm text-slate-300 leading-relaxed mb-3">
        {summary}
      </p>

      {/* Strategic Shift Insight Box */}
      {strategicShift && (
        <div className="p-3 rounded-xl bg-slate-900/90 border-l-4 border-l-brand-500 border border-slate-800 mb-3 text-xs">
          <span className="font-semibold text-brand-400 uppercase tracking-wider block mb-0.5">
            Strategic Shift Detected:
          </span>
          <p className="text-slate-200 leading-normal">
            {strategicShift}
          </p>
        </div>
      )}

      {/* AI Synthesis Note if present */}
      {aiAnalysisNote && (
        <div className="flex items-start space-x-2 text-xs text-indigo-300 bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-900/40 mb-3">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span><strong>Agent Synthesis:</strong> {aiAnalysisNote}</span>
        </div>
      )}

      {/* Tags and External Source */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, idx) => (
            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/50 text-slate-400">
              #{tag}
            </span>
          ))}
        </div>

        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-brand-300 transition-colors"
          >
            <span>Signal Source</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
