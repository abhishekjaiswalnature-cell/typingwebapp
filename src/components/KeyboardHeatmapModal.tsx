import React, { useState } from 'react';
import { X, Flame, Target, RotateCcw, AlertTriangle, CheckCircle2, Play } from 'lucide-react';
import { QWERTY_ROWS, HINDI_INSCRIPT_MAPPING, FINGER_NAMES } from '../services/keyboardMapping';
import { KeyPerformance, WeakKeyService } from '../services/weakKeyService';
import { Lesson, UserProfile } from '../types/typing';

interface KeyboardHeatmapModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onStartCustomLesson: (lesson: Lesson) => void;
}

export const KeyboardHeatmapModal: React.FC<KeyboardHeatmapModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onStartCustomLesson,
}) => {
  const [selectedKey, setSelectedKey] = useState<KeyPerformance | null>(null);
  const [selectedKeyChar, setSelectedKeyChar] = useState<string>('k');

  if (!isOpen) return null;

  // Retrieve user weak keys
  const weakEn = WeakKeyService.getWeakKeys(currentUser.id, 'en', 10);
  const weakHi = WeakKeyService.getWeakKeys(currentUser.id, 'hi', 10);

  // Helper to get stats for a key label
  const getStats = (char: string): KeyPerformance | null => {
    const list = [...weakEn, ...weakHi];
    return list.find((k) => k.char.toLowerCase() === char.toLowerCase()) || null;
  };

  // Color mapper based on errors / accuracy
  const getKeyColor = (char: string) => {
    const stats = getStats(char);
    if (!stats || stats.attempts === 0) {
      return 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400';
    }
    const acc = 1 - stats.errorRate;
    if (acc < 0.7 || stats.errors >= 3) {
      return 'bg-rose-100 border-rose-400 text-rose-900 shadow-xs hover:bg-rose-200';
    }
    if (acc < 0.85) {
      return 'bg-amber-100 border-amber-400 text-amber-900 hover:bg-amber-200';
    }
    return 'bg-emerald-100 border-emerald-400 text-emerald-900 hover:bg-emerald-200';
  };

  const handlePracticeAllWeak = (lang: 'en' | 'hi') => {
    const list = lang === 'hi' ? weakHi : weakEn;
    const chars = list.map((k) => k.char);
    const drill = WeakKeyService.generate1to4ProgressiveDrill(chars, lang);
    onStartCustomLesson(drill);
    onClose();
  };

  const handlePracticeSingleKey = (char: string) => {
    const isHi = /[\u0900-\u097F]/.test(char);
    const drill = WeakKeyService.generate1to4ProgressiveDrill([char], isHi ? 'hi' : 'en');
    onStartCustomLesson(drill);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Keystroke Accuracy Heatmap & Diagnostics
              </h2>
              <p className="text-xs text-slate-500">
                Visual analysis of error clusters, hesitation hotspots, and weak finger reaches
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Heatmap Legend & Summary */}
        <div className="py-4 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
              Accuracy Scale:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-400" />
              <span className="text-slate-600 font-semibold">95-100% Solid</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-100 border border-amber-400" />
              <span className="text-slate-600 font-semibold">85-94% Caution</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-100 border border-rose-400" />
              <span className="text-slate-600 font-semibold">&lt;85% Weak Hotspot</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePracticeAllWeak('en')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Drill English Weak Keys</span>
            </button>
            <button
              onClick={() => handlePracticeAllWeak('hi')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Drill Hindi Weak Keys</span>
            </button>
          </div>
        </div>

        {/* Visual Interactive Keyboard Grid */}
        <div className="py-6 flex flex-col items-center gap-2 overflow-x-auto">
          {QWERTY_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1.5 justify-center w-full min-w-[620px]">
              {row.map((key) => {
                const lowerChar = key.label.length === 1 ? key.label.toLowerCase() : '';
                const hindiChar = HINDI_INSCRIPT_MAPPING[key.code]?.normal || '';
                const colorClass = lowerChar ? getKeyColor(lowerChar) : 'bg-slate-100 border-slate-200 text-slate-500';

                return (
                  <button
                    key={key.code}
                    onClick={() => {
                      if (lowerChar) {
                        setSelectedKeyChar(lowerChar);
                        setSelectedKey(getStats(lowerChar));
                      }
                    }}
                    style={{ flex: `${key.widthUnit} 0 auto` }}
                    className={`h-11 sm:h-12 rounded-xl border flex flex-col items-center justify-center p-1 font-mono transition-all cursor-pointer ${colorClass} ${
                      selectedKeyChar === lowerChar ? 'ring-2 ring-slate-800 scale-105 z-10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs sm:text-sm">{key.label}</span>
                      {hindiChar && (
                        <span className="text-[10px] text-amber-800 font-bold opacity-80">
                          {hindiChar}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Selected Key Diagnostic Card */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-mono font-black text-xl text-slate-900 shadow-xs">
              {selectedKeyChar.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-800">
                  Key: &quot;{selectedKeyChar}&quot;
                </span>
                {selectedKey && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedKey.errorRate > 0.2
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {Math.round((1 - selectedKey.errorRate) * 100)}% Accuracy
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {selectedKey
                  ? `${selectedKey.attempts} strokes recorded · ${selectedKey.errors} missed · ~${selectedKey.avgLatencyMs}ms avg latency`
                  : 'No errors logged yet for this key! Click to practice.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePracticeSingleKey(selectedKeyChar)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Practice &quot;{selectedKeyChar}&quot; (1-to-4 Drill)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
