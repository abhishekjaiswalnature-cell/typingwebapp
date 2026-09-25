import React, { useEffect, useState } from 'react';
import { TypingMetrics } from '../types/typing';
import { RotateCcw, ArrowRight, CheckCircle2, Target, Flame, Activity } from 'lucide-react';
import { FINGER_NAMES } from '../services/keyboardMapping';
import { StreakState } from '../services/streakService';

interface CompletionModalProps {
  isOpen: boolean;
  metrics: TypingMetrics;
  lessonTitle: string;
  hasNextLesson: boolean;
  onNextLesson: () => void;
  onRetryLesson: () => void;
  onPracticeWeakKeys?: (keys: string[]) => void;
  onOpenHeatmap?: () => void;
  onClose: () => void;
  dailyStreak?: StreakState;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  metrics,
  lessonTitle,
  hasNextLesson,
  onNextLesson,
  onRetryLesson,
  onPracticeWeakKeys,
  onOpenHeatmap,
  onClose,
  dailyStreak,
}) => {
  const [displayWpm, setDisplayWpm] = useState(0);
  const [displayAccuracy, setDisplayAccuracy] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setDisplayWpm(0);
      setDisplayAccuracy(0);
      return;
    }

    const duration = 800;
    const startTime = performance.now();

    const frame = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - progress, 3);

      setDisplayWpm(Math.round(metrics.wpm * ease));
      setDisplayAccuracy(Math.round(metrics.accuracy * ease));

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    const handle = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(handle);
  }, [isOpen, metrics.wpm, metrics.accuracy]);

  if (!isOpen) return null;

  const mistypedFingers = Object.entries(metrics.fingerErrors)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-600">
              Exercise Complete
            </span>
            <h2 id="completion-title" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {lessonTitle}
            </h2>
          </div>
        </div>

        {/* Primary Metric Scorecards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 flex flex-col">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Speed</span>
            <span className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">
              {displayWpm}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">WPM</span>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 flex flex-col">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Accuracy</span>
            <span
              className={`font-mono text-2xl font-extrabold tabular-nums ${
                displayAccuracy >= 95 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {displayAccuracy}%
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">{metrics.errorKeystrokes} errors</span>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 flex flex-col">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Consistency</span>
            <span className="font-mono text-2xl font-extrabold text-sky-600 tabular-nums">
              {metrics.rhythmConsistency}%
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">cadence</span>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 flex flex-col">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Best Streak</span>
            <span className="font-mono text-2xl font-extrabold text-purple-600 tabular-nums">
              {metrics.bestStreak}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">in flow</span>
          </div>
        </div>

        {/* Daily Streak Progress Card */}
        {dailyStreak && (
          <div
            className={`rounded-2xl p-3 sm:p-3.5 flex items-center justify-between border transition-all ${
              dailyStreak.goalReachedToday
                ? 'bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border-amber-300 shadow-xs text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  dailyStreak.goalReachedToday
                    ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-orange-500/20'
                    : 'bg-amber-100 text-amber-600'
                }`}
              >
                <Flame
                  className={`w-5 h-5 ${
                    dailyStreak.goalReachedToday
                      ? 'fill-white animate-flame-flicker drop-shadow-xs'
                      : 'fill-amber-400'
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                  <span>{dailyStreak.currentStreak} Day Practice Streak</span>
                  {dailyStreak.goalReachedToday ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.2 rounded-full font-bold">
                      Goal Achieved! 🔥
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-semibold">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {dailyStreak.todayLessonsCompleted} of {dailyStreak.dailyGoal} lessons completed today
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs font-mono font-extrabold text-amber-900">
                {Math.min(
                  100,
                  Math.round(
                    (dailyStreak.todayLessonsCompleted / Math.max(1, dailyStreak.dailyGoal)) * 100
                  )
                )}
                %
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Daily Goal</span>
            </div>
          </div>
        )}

        {/* Diagnostic Finger Analysis */}
        {mistypedFingers.length > 0 ? (
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
              Diagnostic Focus
            </span>
            <div className="flex flex-wrap gap-2">
              {mistypedFingers.map(([fingerKey, count]) => (
                <div
                  key={fingerKey}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs"
                >
                  <span className="font-bold">
                    {FINGER_NAMES[fingerKey as keyof typeof FINGER_NAMES]}
                  </span>
                  <span className="text-amber-600 font-mono font-bold">
                    {count} {count === 1 ? 'slip' : 'slips'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center text-xs text-emerald-800 font-medium">
            Pristine run! 100% finger accuracy on this exercise.
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2.5 pt-2">
          {/* Remediation & Diagnostics Row if there were errors */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            {metrics.errorKeystrokes > 0 && onPracticeWeakKeys ? (
              <button
                onClick={() => onPracticeWeakKeys(Object.keys(metrics.keyErrors))}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Target className="w-4 h-4 text-amber-600" />
                <span>Drill Mistyped Keys (1-to-4 Method)</span>
              </button>
            ) : <div />}

            {onOpenHeatmap && (
              <button
                onClick={onOpenHeatmap}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                <span>View Key Heatmap</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100">
            <button
              onClick={onRetryLesson}
              className="flex items-center gap-1.5 px-5 py-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-2xl border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors cursor-pointer"
              >
                Curriculum
              </button>

              {hasNextLesson && (
                <button
                  onClick={onNextLesson}
                  className="flex items-center gap-1.5 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <span>Next Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
