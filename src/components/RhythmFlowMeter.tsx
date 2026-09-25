import React from 'react';
import { TypingMetrics } from '../types/typing';

interface RhythmFlowMeterProps {
  metrics: TypingMetrics;
  isSlowdown?: boolean;
}

export const RhythmFlowMeter: React.FC<RhythmFlowMeterProps> = ({ metrics, isSlowdown = false }) => {
  const recentDeltas = metrics.keystrokeDeltas.slice(-8);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 px-3 py-1.5 text-xs select-none bg-white/70 border border-slate-200/90 rounded-2xl shadow-sm backdrop-blur-sm">
      {/* Live Metric Stats */}
      <div className="flex items-center gap-6">
        <div className="flex items-baseline gap-1.5">
          <span className="text-slate-500 font-medium">Speed:</span>
          <span className="font-mono text-xl font-extrabold text-slate-900 tabular-nums">{metrics.wpm}</span>
          <span className="text-[11px] text-slate-400 font-semibold uppercase">WPM</span>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-slate-500 font-medium">Accuracy:</span>
          <span
            className={`font-mono text-xl font-extrabold tabular-nums ${
              metrics.accuracy >= 95
                ? 'text-emerald-600'
                : metrics.accuracy >= 85
                ? 'text-amber-600'
                : 'text-rose-600'
            }`}
          >
            {metrics.accuracy}%
          </span>
        </div>

        <div className="hidden sm:flex items-baseline gap-1.5">
          <span className="text-slate-500 font-medium">Consistency:</span>
          <span className="font-mono text-xl font-extrabold text-sky-600 tabular-nums">
            {metrics.rhythmConsistency}%
          </span>
        </div>
      </div>

      {/* Cadence Visualizer & Streak */}
      <div className="flex items-center gap-4">
        {/* Streak Flow Counter */}
        {metrics.currentStreak >= 5 && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-semibold text-xs transition-all ${
              metrics.currentStreak >= 50
                ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-sm'
                : metrics.currentStreak >= 25
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm'
                : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tabular-nums font-mono font-bold">{metrics.currentStreak}</span>
            <span className="text-[10px] uppercase text-slate-500">Flow</span>
          </div>
        )}

        {/* Dynamic Keystroke Delta Cadence Dots */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200"
          title="Keystroke interval consistency"
        >
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider mr-1">
            Cadence
          </span>
          <div className="flex items-center gap-1.5 h-3.5">
            {recentDeltas.length === 0 ? (
              <span className="text-slate-400 text-[10px]">Resting...</span>
            ) : (
              recentDeltas.map((delta, i) => {
                const clamped = Math.max(50, Math.min(600, delta));
                const height = Math.max(4, Math.min(14, 16 - (clamped / 600) * 12));
                const isRapid = clamped < 140;
                const isConsistent = clamped >= 140 && clamped <= 320;

                return (
                  <span
                    key={`delta-${i}`}
                    className={`w-1.5 rounded-full transition-all duration-75 ${
                      isRapid
                        ? 'bg-emerald-500'
                        : isConsistent
                        ? 'bg-sky-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ height: `${height}px` }}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Slowdown Notice */}
        {isSlowdown && (
          <span className="text-xs text-amber-600 font-semibold animate-pulse flex items-center gap-1">
            <span>Steady your cadence</span>
          </span>
        )}
      </div>
    </div>
  );
};
