import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CompetitorProfile from './pages/CompetitorProfile';
import Timeline from './pages/Timeline';
import AIAnalyst from './pages/AIAnalyst';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content View */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/competitors" element={<Navigate to="/competitors/nexus-ai" replace />} />
            <Route path="/competitors/:id" element={<CompetitorProfile />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/analyst" element={<AIAnalyst />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="glass-panel border-t border-slate-900 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-300">CompIntel AI</span> — Persistent Memory Competitive Intelligence Agent
            </div>
            <div className="flex items-center space-x-4">
              <span>Hindsight Vector Engine</span>
              <span>•</span>
              <span>Groq API Integration</span>
              <span>•</span>
              <span>Express + Vite React</span>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}
