import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowUpRight, Cpu, Layers, Database, Activity, TrendingUp } from 'lucide-react';

export default function CompetitorCard({ competitor }) {
  const {
    id,
    name,
    tagline,
    category,
    threatLevel,
    threatScore,
    marketShare,
    techStack = [],
    metrics = {},
    memoryEventCount = 0,
    recentShift
  } = competitor;

  const getThreatBadge = (level) => {
    switch (level?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30 glow-critical';
      case 'HIGH':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default:
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-brand-600/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all duration-300 pointer-events-none" />

      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 inline-block mb-2">
              {category}
            </span>
            <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">
              {name}
            </h3>
          </div>

          <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full border text-xs font-bold ${getThreatBadge(threatLevel)}`}>
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{threatLevel} ({threatScore}/100)</span>
          </div>
        </div>

        <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {tagline}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 mb-4 text-xs">
          <div>
            <span className="text-slate-500 block">Market Share</span>
            <span className="font-semibold text-slate-200">{marketShare || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Quarterly Growth</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 inline" />
              {metrics.quarterlyGrowth || '+15%'}
            </span>
          </div>
        </div>

        {/* Latest Strategic Shift Pill */}
        {recentShift && (
          <div className="mb-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Latest Strategic Memory Shift
            </span>
            <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 italic line-clamp-2">
              "{recentShift}"
            </p>
          </div>
        )}

        {/* Tech Stack Chips */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Key Stack & Capable Tech
          </span>
          <div className="flex flex-wrap gap-1.5">
            {techStack.slice(0, 4).map((tech, idx) => (
              <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50">
                {tech}
              </span>
            ))}
            {techStack.length > 4 && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800/40 text-slate-400">
                +{techStack.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-2">
        <div className="flex items-center space-x-1.5 text-xs text-brand-400 font-medium">
          <Database className="w-3.5 h-3.5" />
          <span>{memoryEventCount} Memory Nodes</span>
        </div>

        <Link
          to={`/competitors/${id}`}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-300 group-hover:text-white bg-slate-800/60 group-hover:bg-brand-600 px-3 py-1.5 rounded-lg border border-slate-700/50 group-hover:border-brand-500 transition-all duration-200"
        >
          <span>View Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
