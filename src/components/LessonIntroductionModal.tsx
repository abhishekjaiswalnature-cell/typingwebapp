import React from 'react';
import { Lesson } from '../types/typing';
import { FINGER_NAMES, FINGER_COLORS } from '../services/keyboardMapping';
import { X } from 'lucide-react';

interface LessonIntroductionModalProps {
  lesson: Lesson;
  isOpen: boolean;
  onStart: () => void;
  onClose?: () => void;
}

export const LessonIntroductionModal: React.FC<LessonIntroductionModalProps> = ({
  lesson,
  isOpen,
  onStart,
  onClose,
}) => {
  if (!isOpen) return null;

  const isHomeRowAnchor = lesson.stage === 1 && lesson.id === 'lesson-1-1';
  const primaryFingerName = lesson.primaryFinger ? FINGER_NAMES[lesson.primaryFinger] : undefined;
  const primaryFingerColor = lesson.primaryFinger ? FINGER_COLORS[lesson.primaryFinger] : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-600">
              Stage {lesson.stage} · {lesson.category}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                {lesson.difficulty}
              </span>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <h2 id="intro-title" className="text-2xl font-bold tracking-tight text-slate-900">
            {lesson.title}
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">{lesson.description}</p>

          {/* First time home row guidance */}
          {isHomeRowAnchor && (
            <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 space-y-2">
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                Home Row Touch Typing Posture
              </h3>
              <p className="text-xs text-slate-700 leading-normal">
                Rest your left fingers gently on <strong className="text-slate-900">A · S · D · F</strong> and
                your right fingers on <strong className="text-slate-900">J · K · L · ;</strong>. Feel the raised
                tactile ridges on <strong className="text-emerald-700 font-bold">F</strong> and{' '}
                <strong className="text-emerald-700 font-bold">J</strong> with your index fingertips.
              </p>
            </div>
          )}

          {/* Target Keys & Finger Highlight */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between">
            <div>
              <span className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                Target Keys
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lesson.targetKeys.slice(0, 8).map((key) => (
                  <span
                    key={key}
                    className="inline-flex items-center justify-center min-w-[32px] h-8 px-2.5 rounded-xl bg-white border border-slate-300 font-mono text-sm font-bold text-slate-900 shadow-2xs"
                  >
                    {key === ' ' ? 'Space' : key}
                  </span>
                ))}
              </div>
            </div>

            {primaryFingerName && primaryFingerColor && (
              <div className="text-right">
                <span className="block text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">
                  Primary Reach
                </span>
                <span
                  className={`inline-block px-3 py-1 rounded-xl text-xs font-bold ${primaryFingerColor.lightBg} ${primaryFingerColor.text} border ${primaryFingerColor.border}`}
                >
                  {primaryFingerName}
                </span>
              </div>
            )}
          </div>

          <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Press Space or Enter to begin</span>
            <button
              onClick={onStart}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              Start Exercise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
