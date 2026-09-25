import React from 'react';
import { UserProfile } from '../types/typing';
import { X, Award, Flame, Zap, Target, Check } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  users: UserProfile[];
  currentUserId: string;
  onSelectUser: (user: UserProfile) => void;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  users,
  currentUserId,
  onSelectUser,
  onClose,
}) => {
  if (!isOpen) return null;

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
    >
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-600">Typist Account</span>
            <h2 id="profile-title" className="text-xl font-bold text-slate-900 tracking-tight">
              User Profiles & Progress
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active User Card */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/80">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 truncate">{currentUser.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{currentUser.bio}</p>
            </div>
          </div>

          {/* Quick Metrics Bar for Current User */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-emerald-200/60 text-center">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                Best
              </span>
              <span className="font-mono text-base font-bold text-slate-900">{currentUser.stats.bestWpm} <span className="text-[10px] text-slate-500 font-normal">WPM</span></span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center justify-center gap-1">
                <Target className="w-3 h-3 text-emerald-600" />
                Acc
              </span>
              <span className="font-mono text-base font-bold text-slate-900">{currentUser.stats.averageAccuracy}%</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center justify-center gap-1">
                <Award className="w-3 h-3 text-purple-600" />
                Passed
              </span>
              <span className="font-mono text-base font-bold text-slate-900">{currentUser.stats.totalCompletedLessons}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-semibold uppercase flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-rose-500" />
                Streak
              </span>
              <span className="font-mono text-base font-bold text-slate-900">{currentUser.stats.streakDays}d</span>
            </div>
          </div>
        </div>

        {/* Switch Typist Profile */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Switch Typist
          </span>
          {users.map((u) => {
            const isSelected = u.id === currentUserId;
            return (
              <button
                key={u.id}
                onClick={() => {
                  onSelectUser(u);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-slate-50 border-emerald-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shadow-xs"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors block">
                      {u.name}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{u.stats.bestWpm} WPM</span>
                      <span>·</span>
                      <span>{u.stats.totalCompletedLessons} lessons</span>
                      <span>·</span>
                      <span>{u.stats.streakDays} day streak</span>
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-emerald-600">
                    Switch
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
