import React from 'react';
import { UserPreferences, ErrorMode, SwitchSound } from '../types/typing';
import { X, Sliders, Volume2, Eye } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  preferences,
  onUpdatePreferences,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 flex flex-col shadow-2xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            <h2 id="settings-title" className="text-xl font-bold text-slate-900 tracking-tight">
              Tutor Preferences
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6">
          {/* Section: Error Handling Mode */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Error Handling Mode
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  id: 'ignore',
                  title: 'Continuous / Free Flow (Recommended)',
                  desc: 'Never blocks typing. Wrong characters are highlighted in red and cursor advances without interruption.',
                },
                {
                  id: 'require_backspace',
                  title: 'Require Backspace',
                  desc: 'Incorrect key advances into error state. You must press Backspace to remove slips.',
                },
                {
                  id: 'block_until_correct',
                  title: 'Block Until Correct',
                  desc: 'Cursor stays on target until you press the exact physical key.',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onUpdatePreferences({ errorMode: item.id as ErrorMode })}
                  className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    preferences.errorMode === item.id
                      ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`block text-xs font-bold ${
                      preferences.errorMode === item.id ? 'text-emerald-700' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Keyboard Layout Display */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              Keyboard Layout & Display Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdatePreferences({ keyboardLayout: 'qwerty' })}
                className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                  preferences.keyboardLayout !== 'hindi-inscript'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                Standard ANSI QWERTY
              </button>
              <button
                onClick={() => onUpdatePreferences({ keyboardLayout: 'hindi-inscript' })}
                className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                  preferences.keyboardLayout === 'hindi-inscript'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                हिन्दी InScript (Devanagari)
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              InScript mode shows Devanagari characters on keys and translates physical QWERTY keystrokes to Hindi letters.
            </p>
          </div>

          {/* Section: Mechanical Switch Sound */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Tactile Switch Acoustics (Web Audio)
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'cherry_blue', label: 'Cherry MX Blue (Clicky)' },
                { id: 'cherry_red', label: 'Cherry MX Red (Linear)' },
                { id: 'topre', label: 'Topre (Warm Thock)' },
                { id: 'off', label: 'Muted (Silent)' },
              ].map((sw) => (
                <button
                  key={sw.id}
                  onClick={() => onUpdatePreferences({ switchSound: sw.id as SwitchSound })}
                  className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                    preferences.switchSound === sw.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {sw.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Kinetic Visuals & Hands */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Kinetic Visual Guidance
              </label>
            </div>

            <div className="space-y-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-900">Dynamic Virtual Hands</span>
                  <span className="block text-[11px] text-slate-500">
                    Articulated fingers travel smoothly to target keys
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.showHands}
                  onChange={(e) => onUpdatePreferences({ showHands: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/80">
                <div>
                  <span className="block text-xs font-bold text-slate-900">Speed-Adaptive Animation</span>
                  <span className="block text-[11px] text-slate-500">
                    Compresses travel duration at higher WPM for instant responsiveness
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.speedAdaptiveAnimation}
                  onChange={(e) => onUpdatePreferences({ speedAdaptiveAnimation: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/80">
                <div>
                  <span className="block text-xs font-bold text-slate-900">Keyboard Finger Zones</span>
                  <span className="block text-[11px] text-slate-500">
                    Ambient tint on keycaps showing touch-typing finger ownership
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.showKeyboardZones}
                  onChange={(e) => onUpdatePreferences({ showKeyboardZones: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/80">
                <div>
                  <span className="block text-xs font-bold text-slate-900">Reduced Motion Mode</span>
                  <span className="block text-[11px] text-slate-500">
                    Disables continuous finger travel and uses instant key highlights
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.reducedMotion}
                  onChange={(e) => onUpdatePreferences({ reducedMotion: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Apply & Return
          </button>
        </div>
      </div>
    </div>
  );
};
