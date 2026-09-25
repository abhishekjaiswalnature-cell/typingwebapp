import React, { useState, useRef, useEffect } from 'react';
import { Flame, Sparkles, Check, ChevronDown, Trophy, Calendar, Target } from 'lucide-react';
import { StreakState, StreakService, DayActivity } from '../services/streakService';

interface DailyStreakCounterProps {
  streak: StreakState;
  onUpdateGoal: (newGoal: number) => void;
  isCelebratingGoal?: boolean;
}

export const DailyStreakCounter: React.FC<DailyStreakCounterProps> = ({
  streak,
  onUpdateGoal,
  isCelebratingGoal = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localCelebrating, setLocalCelebrating] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const activeCelebrating = isCelebratingGoal || localCelebrating;

  // Sync external celebrate trigger
  useEffect(() => {
    if (isCelebratingGoal) {
      setLocalCelebrating(true);
      const timer = setTimeout(() => {
        setLocalCelebrating(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isCelebratingGoal]);

  // Click outside listener for popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const last7Days: DayActivity[] = React.useMemo(() => {
    return StreakService.getLast7Days();
  }, [streak]);

  const progressPercent = Math.min(
    100,
    Math.round((streak.todayLessonsCompleted / Math.max(1, streak.dailyGoal)) * 100)
  );

  const isGoalMet = streak.goalReachedToday || streak.todayLessonsCompleted >= streak.dailyGoal;
  const hasStreak = streak.currentStreak > 0;

  // Format day name for matrix
  const getDayShortName = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('en-US', { weekday: 'narrow' });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative inline-block">
      {/* Visual TopBar Counter Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Daily Streak: ${streak.currentStreak} days. Goal: ${streak.todayLessonsCompleted} of ${streak.dailyGoal} completed.`}
        className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 cursor-pointer shadow-xs select-none ${
          isGoalMet
            ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 border-amber-400 text-amber-950 hover:border-amber-500 shadow-amber-500/10'
            : hasStreak
            ? 'bg-amber-50/80 hover:bg-amber-100/90 border-amber-200/90 text-amber-900 shadow-xs'
            : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-600'
        } ${activeCelebrating ? 'ring-2 ring-amber-400 animate-halo-pulse scale-105' : ''}`}
        title="View Daily Practice Streak & Goal"
      >
        {/* Animated Flame Icon Container */}
        <div className="relative flex items-center justify-center">
          {/* Flame aura/burst when celebrating */}
          {activeCelebrating && (
            <span className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 opacity-75 blur-xs animate-ping" />
          )}

          <Flame
            className={`w-4 h-4 transition-transform duration-300 ${
              activeCelebrating
                ? 'text-orange-500 fill-orange-500 animate-flame-pop'
                : isGoalMet
                ? 'text-orange-500 fill-orange-500 animate-flame-flicker drop-shadow-[0_0_6px_rgba(249,115,22,0.6)]'
                : hasStreak
                ? 'text-amber-500 fill-amber-400/80 group-hover:scale-110'
                : 'text-slate-400 fill-slate-300 group-hover:text-amber-400'
            }`}
          />

          {/* Tiny spark stars when goal met */}
          {isGoalMet && (
            <Sparkles className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 text-amber-400 animate-sparkle pointer-events-none" />
          )}
        </div>

        {/* Streak Number & Label */}
        <div className="flex items-center gap-1">
          <span
            className={`font-extrabold tracking-tight ${
              isGoalMet
                ? 'text-orange-950 drop-shadow-xs'
                : hasStreak
                ? 'text-amber-900'
                : 'text-slate-600'
            }`}
          >
            {streak.currentStreak}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800/80 hidden sm:inline">
            {streak.currentStreak === 1 ? 'day' : 'days'}
          </span>
        </div>

        {/* Mini Goal Progress Badge */}
        <div
          className={`flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none ${
            isGoalMet
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-amber-200/70 text-amber-900'
          }`}
          title={`${streak.todayLessonsCompleted} / ${streak.dailyGoal} lessons completed today`}
        >
          {isGoalMet ? (
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          ) : (
            `${streak.todayLessonsCompleted}/${streak.dailyGoal}`
          )}
        </div>

        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 hidden sm:block ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown Card */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Card Header with Animated Flame Showcase */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div
                className={`relative w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner ${
                  isGoalMet
                    ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white shadow-orange-500/30'
                    : 'bg-amber-100 text-amber-600'
                }`}
              >
                <Flame
                  className={`w-6 h-6 ${
                    isGoalMet
                      ? 'fill-white animate-flame-flicker drop-shadow-md'
                      : 'fill-amber-400'
                  }`}
                />
                {isGoalMet && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold shadow-xs">
                    ✓
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {streak.currentStreak} Day Practice Streak
                  </h3>
                </div>
                <p className="text-xs text-slate-500">
                  {isGoalMet
                    ? '🔥 Daily goal achieved today!'
                    : `${Math.max(0, streak.dailyGoal - streak.todayLessonsCompleted)} more to reach today's goal`}
                </p>
              </div>
            </div>

            {/* Best Streak Badge */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Best Record
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span>{streak.bestStreak}d</span>
              </div>
            </div>
          </div>

          {/* Today's Goal Progress Section */}
          <div className="my-3.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1 text-slate-700">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                Today's Practice Target
              </span>
              <span className="font-mono text-slate-900 font-bold">
                {streak.todayLessonsCompleted} / {streak.dailyGoal} completed
              </span>
            </div>

            {/* Smooth Gradient Progress Bar */}
            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isGoalMet
                    ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>{isGoalMet ? '🔥 Streak secured for today!' : 'Complete lessons to advance streak'}</span>
              <span className="font-bold text-slate-700">{progressPercent}%</span>
            </div>
          </div>

          {/* 7-Day Matrix */}
          <div className="mb-3.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span className="flex items-center gap-1 text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Last 7 Days
              </span>
              <span className="text-[10px] font-normal text-slate-400">Activity History</span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {last7Days.map((day, idx) => {
                const isToday = idx === 6;
                const isCompleted = day.goalMet || (isToday && isGoalMet);
                const hasPractice = day.lessonsCount > 0;

                return (
                  <div
                    key={day.date}
                    className={`flex flex-col items-center p-1.5 rounded-xl border transition-colors ${
                      isToday
                        ? 'border-amber-400 bg-amber-50/50 ring-1 ring-amber-300'
                        : isCompleted
                        ? 'border-emerald-200 bg-emerald-50/60'
                        : hasPractice
                        ? 'border-amber-100 bg-amber-50/30'
                        : 'border-slate-100 bg-slate-50/70'
                    }`}
                  >
                    <span
                      className={`text-[10px] font-bold ${
                        isToday ? 'text-amber-800' : 'text-slate-400'
                      }`}
                    >
                      {getDayShortName(day.date)}
                    </span>

                    <div className="my-1">
                      {isCompleted ? (
                        <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                      ) : hasPractice ? (
                        <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-[8px] font-bold text-white">
                          {day.lessonsCount}
                        </div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300 my-0.75" />
                      )}
                    </div>

                    <span className="text-[9px] font-mono text-slate-500">
                      {day.lessonsCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Goal Setting & Demo Controls */}
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500 font-medium mr-1">Daily Target:</span>
              {[1, 3, 5, 10].map((goalNum) => (
                <button
                  key={goalNum}
                  onClick={() => onUpdateGoal(goalNum)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                    streak.dailyGoal === goalNum
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                  title={`Set goal to ${goalNum} lessons/day`}
                >
                  {goalNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setLocalCelebrating(true);
                setTimeout(() => setLocalCelebrating(false), 3000);
              }}
              className="text-[10px] font-bold text-amber-700 hover:text-amber-800 hover:bg-amber-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
              title="Preview the goal achievement flame celebration"
            >
              Test Flame ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
