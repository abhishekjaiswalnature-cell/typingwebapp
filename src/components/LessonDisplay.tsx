import React, { useEffect, useRef, useMemo } from 'react';
import { CharacterState } from '../services/typingEngine';
import { ErrorMode } from '../types/typing';

interface LessonDisplayProps {
  characters: CharacterState[];
  cursorIndex: number;
  errorMode: ErrorMode;
  errorStackLength: number;
  isSlowdown?: boolean;
}

export const LessonDisplay: React.FC<LessonDisplayProps> = ({
  characters,
  cursorIndex,
  errorMode,
  errorStackLength,
  isSlowdown = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeCharRef = useRef<HTMLSpanElement | null>(null);

  const isHindi = useMemo(() => {
    return characters.some((c) => /[\u0900-\u097F]/.test(c.char));
  }, [characters]);

  const progressPercent = characters.length > 0 ? Math.round((cursorIndex / characters.length) * 100) : 0;

  // Auto-scroll to keep active character in view
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const container = containerRef.current;
      const target = activeCharRef.current;

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const relativeTop = targetRect.top - containerRect.top;
      if (relativeTop > containerRect.height * 0.65 || relativeTop < containerRect.height * 0.2) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [cursorIndex]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] min-h-[180px] max-h-[290px] flex flex-col justify-start overflow-y-auto"
      tabIndex={0}
      role="region"
      aria-label="Typing text preview"
    >
      {/* Top micro progress for paragraphs & drills */}
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-3 select-none">
        <span className="flex items-center gap-1.5">
          {isHindi && (
            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
              हिन्दी Devanagari
            </span>
          )}
          {characters.length > 100 && (
            <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold border border-sky-200">
              Paragraph Mode
            </span>
          )}
        </span>
        <span className="tabular-nums">
          {cursorIndex} / {characters.length} chars · {progressPercent}%
        </span>
      </div>

      <div
        className={`relative ${
          isHindi
            ? "font-['Noto_Sans_Devanagari','Plus_Jakarta_Sans',sans-serif] text-2xl sm:text-3xl leading-[2.1] tracking-normal"
            : "font-mono text-2xl sm:text-3xl leading-relaxed tracking-wider"
        } break-words select-none w-full`}
      >
        {characters.map((item, idx) => {
          const isCurrent = idx === cursorIndex;
          const isPast = idx < cursorIndex;
          const isCorrect = item.status === 'correct';
          const isError = item.status === 'incorrect';

          // Visual indicator for space: use real blank space, NOT a dot/point (USER REQUEST)
          const isSpace = item.char === ' ';
          const displayChar = isSpace ? '\u00A0' : item.char;

          let charClasses = 'transition-colors duration-75 relative inline-block ';

          if (isCurrent) {
            charClasses += 'text-slate-900 font-bold ';
            if (isError) {
              charClasses += 'text-rose-600 animate-shake ';
            } else if (isSlowdown) {
              charClasses += 'text-amber-600 ';
            }
          } else if (isPast) {
            if (isCorrect) {
              charClasses += 'text-emerald-600 ';
            } else if (isError) {
              charClasses += 'text-rose-600 bg-rose-50 rounded px-0.5 underline decoration-rose-400 ';
            }
          } else {
            // Future characters: legible neutral slate
            charClasses += 'text-slate-400 ';
          }

          return (
            <span
              key={`char-${idx}`}
              ref={isCurrent ? activeCharRef : undefined}
              className={charClasses}
              style={{
                minWidth: isSpace ? '0.65em' : undefined,
              }}
            >
              {/* Custom Caret on Current Character */}
              {isCurrent && (
                <span
                  className={`absolute -left-[2px] top-1 bottom-1 w-[3px] rounded-full pointer-events-none transition-all duration-75 ${
                    isError
                      ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                      : isSlowdown
                      ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                      : 'bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.7)] animate-pulse'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Current Character Target Highlighting Box */}
              {isCurrent && (
                <span
                  className={`absolute -inset-x-1 -inset-y-0.5 rounded pointer-events-none border-b-2 transition-all ${
                    isError
                      ? 'bg-rose-100/60 border-rose-500'
                      : isSlowdown
                      ? 'bg-amber-100/60 border-amber-500'
                      : 'bg-emerald-100/60 border-emerald-500'
                  }`}
                  aria-hidden="true"
                />
              )}

              {displayChar}
            </span>
          );
        })}

        {/* Require Backspace mode error warning */}
        {errorMode === 'require_backspace' && errorStackLength > 0 && (
          <span className="ml-3 inline-flex items-center gap-1.5 text-xs text-amber-700 font-sans font-medium px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg">
            <span>Press Backspace to correct slip</span>
          </span>
        )}
      </div>
    </div>
  );
};
