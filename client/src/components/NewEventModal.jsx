import React, { useState } from 'react';
import { X, Database, Plus, CheckCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function NewEventModal({ isOpen, onClose, competitors = [], onEventAdded }) {
  const [formData, setFormData] = useState({
    competitorId: competitors[0]?.id || 'nexus-ai',
    title: '',
    summary: '',
    category: 'Product',
    severity: 'HIGH',
    impactScore: 80,
    strategicShift: '',
    tags: 'API, Release, Strategy',
    sourceUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        impactScore: Number(formData.impactScore)
      };

      const res = await api.createEvent(payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onEventAdded && onEventAdded(res.data);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to index event into memory.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-brand-600/20 text-brand-400 border border-brand-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Index Event into Hindsight Memory
            </h3>
            <p className="text-xs text-slate-400">
              Record a new competitor move to update long-term AI strategy vectors.
            </p>
          </div>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">Event Indexed Successfully!</h4>
            <p className="text-xs text-slate-400">Hindsight Memory graph updated in real-time.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {/* Select Competitor */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Competitor *
              </label>
              <select
                value={formData.competitorId}
                onChange={(e) => setFormData({ ...formData, competitorId: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-500"
              >
                {competitors.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Slashed Enterprise tier pricing by 20%"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Category & Severity Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="Pricing">Pricing</option>
                  <option value="Product">Product</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Patent">Patent</option>
                  <option value="Strategy">Strategy</option>
                  <option value="M&A">M&A</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Threat Severity
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Event Summary *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Provide detailed description of what took place..."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Strategic Shift Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Strategic Shift Impact (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Land-grab tactic targeting enterprise migration"
                value={formData.strategicShift}
                onChange={(e) => setFormData({ ...formData, strategicShift: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/30"
              >
                {loading ? (
                  <span>Indexing Memory...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Store Event Node</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
