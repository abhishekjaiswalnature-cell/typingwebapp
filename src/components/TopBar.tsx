import React from 'react';
import {
  Volume2,
  VolumeX,
  Settings,
  BookOpen,
  RotateCcw,
  Globe,
  Timer,
  Target,
  Activity,
  HelpCircle,
} from 'lucide-react';
import { SwitchSound, UserProfile, KeyboardLayoutMode } from '../types/typing';
import { DailyStreakCounter } from './DailyStreakCounter';
import { StreakState } from '../services/streakService';

interface TopBarProps {
  onOpenLessons: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenSpeedTest: () => void;
  onOpenWeakKeys: () => void;
  onOpenHindiMap: () => void;
  onOpenHeatmap: () => void;
  currentUser: UserProfile;
  switchSound: SwitchSound;
  onToggleSound: () => void;
  onResetLesson: () => void;
  activeLessonTitle: string;
  isHindiLesson: boolean;
  keyboardLayout: KeyboardLayoutMode;
  onToggleLayout: () => void;
  streak: StreakState;
  onUpdateStreakGoal: (goal: number) => void;
  isCelebratingStreakGoal?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenLessons,
  onOpenSettings,
  onOpenProfile,
  onOpenSpeedTest,
  onOpenWeakKeys,
  onOpenHindiMap,
  onOpenHeatmap,
  currentUser,
  switchSound,
  onToggleSound,
  onResetLesson,
  activeLessonTitle,
  isHindiLesson,
  keyboardLayout,
  onToggleLayout,
  streak,
  onUpdateStreakGoal,
  isCelebratingStreakGoal,
}) => {
  return (
    <header className="w-full border-b border-slate-200/90 bg-white/95 px-3 sm:px-6 py-2.5 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Active Lesson Tag */}
        <div className="flex items-center gap-2.5">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onResetLesson();
            }}
            className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 hover:text-emerald-600 transition-colors"
          >
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
            <span>Kinesis</span>
          </a>

          <div className="hidden lg:flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 max-w-[170px] truncate">
              {activeLessonTitle}
            </span>
            {isHindiLesson && (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                हिन्दी Mode
              </span>
            )}
          </div>
        </div>

        {/* Navigation Links & High-Value Tools */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-600">
          <button
            onClick={onOpenLessons}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            title="Curriculum & Lessons"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Lessons</span>
          </button>

          {/* Timed Speed Test Button */}
          <button
            onClick={onOpenSpeedTest}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition-colors cursor-pointer"
            title="Official Speed Exam & Certificate"
          >
            <Timer className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline">Speed Test</span>
          </button>

          {/* Weak Keys Practice Button */}
          <button
            onClick={onOpenWeakKeys}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/80 transition-colors cursor-pointer"
            title="Smart Weak-Key 1-to-4 Drill Generator"
          >
            <Target className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden md:inline">Weak Keys</span>
          </button>

          {/* Hindi Character Map Button */}
          <button
            onClick={onOpenHindiMap}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200/80 transition-colors cursor-pointer"
            title="Devanagari InScript Key Reference & Explorer"
          >
            <span className="font-bold text-sky-700 text-xs">क</span>
            <span className="hidden md:inline">Hindi Map</span>
          </button>

          {/* Keystroke Heatmap Button */}
          <button
            onClick={onOpenHeatmap}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors cursor-pointer"
            title="Keystroke Accuracy Heatmap"
          >
            <Activity className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden lg:inline">Heatmap</span>
          </button>

          {/* Quick Layout Mode Switcher */}
          <button
            onClick={onToggleLayout}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Toggle between QWERTY and Hindi InScript layout display"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{keyboardLayout === 'hindi-inscript' ? 'हिन्दी' : 'EN'}</span>
          </button>
        </nav>

        {/* Action Controls & User Profile Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Daily Streak Counter with Flame Animation */}
          <DailyStreakCounter
            streak={streak}
            onUpdateGoal={onUpdateStreakGoal}
            isCelebratingGoal={isCelebratingStreakGoal}
          />

          {/* Typist Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 transition-all cursor-pointer shadow-xs"
            title="Switch Typist Profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-300"
            />
            <span className="text-xs font-bold text-slate-800 hidden md:inline">{currentUser.name.split(' ')[0]}</span>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
              {currentUser.stats.bestWpm}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={switchSound === 'off' ? 'Unmute switch audio' : 'Mute switch audio'}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
            title={`Switch Sound: ${switchSound.replace('_', ' ')}`}
          >
            {switchSound === 'off' ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-xs"
            title="Typing Tutor Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
