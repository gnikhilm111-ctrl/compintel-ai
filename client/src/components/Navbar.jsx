import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, BrainCircuit, Activity, Cpu, Sparkles, Clock, LayoutDashboard, UserCheck } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.getHealthStatus()
      .then(res => setHealth(res))
      .catch(() => setHealth({ status: 'offline', llmProvider: 'Local Engine' }));
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Competitors', path: '/competitors/nexus-ai', icon: UserCheck },
    { name: 'Timeline', path: '/timeline', icon: Clock },
    { name: 'AI Analyst', path: '/analyst', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform duration-200">
            <BrainCircuit className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                CompIntel
              </span>
              <span className="px-2 py-0.5 text-xs font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-full">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Hindsight Memory Agent
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Status Pills & Indicators */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-mono">Hindsight Memory</span>
            <span className="text-slate-500">|</span>
            <span className="text-brand-400 font-semibold">
              {health?.llmProvider || 'Groq / Local'}
            </span>
          </div>

          <Link
            to="/analyst"
            className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI Agent</span>
          </Link>
        </div>

      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex justify-around py-2 bg-slate-950/90 border-t border-slate-900">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-3 text-xs font-medium ${
                  isActive ? 'text-brand-400 font-bold' : 'text-slate-400'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </header>
  );
}
