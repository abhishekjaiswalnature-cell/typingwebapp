import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Sliders, Activity } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

interface RhythmMetronomeProps {
  currentWpm: number;
  isTyping: boolean;
}

export const RhythmMetronome: React.FC<RhythmMetronomeProps> = ({ currentWpm, isTyping }) => {
  const [isActive, setIsActive] = useState(false);
  const [targetWpm, setTargetWpm] = useState(40);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [beatPulse, setBeatPulse] = useState(false);
  const beatCountRef = useRef(0);

  // Metronome interval: In typing, 1 word = 5 keystrokes.
  // Beat every word: 60000 / targetWpm ms
  // Or beat every quarter note (keystroke rhythm): 60000 / (targetWpm * 5) ms.
  // Beating every second stroke or every word is musical. Beating on every word (or 2 keystrokes) creates a perfect cadence.
  // Let's use 1 beat per keystroke cluster (every 2.5 keystrokes or word beat):
  // Let's make the beat tempo: BPM = targetWpm (1 beat per word) or targetWpm * 2.
  const intervalMs = Math.round(60000 / targetWpm);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      beatCountRef.current = (beatCountRef.current + 1) % 4;
      const isAccent = beatCountRef.current === 0;

      setBeatPulse(true);
      setTimeout(() => setBeatPulse(false), 90);

      if (soundEnabled) {
        audioEngine.playMetronomeTick(isAccent);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isActive, intervalMs, soundEnabled]);

  // Pace Delta
  const delta = isTyping && currentWpm > 0 ? Math.round(currentWpm - targetWpm) : 0;

  return (
    <div className="w-full max-w-5xl bg-white border border-slate-200/90 rounded-2xl p-3 sm:px-4 sm:py-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Metronome Toggle & Pulse Indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            isActive
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          title="Toggle Metronome rhythm guide"
        >
          {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isActive ? 'Metronome Active' : 'Rhythm Metronome'}</span>
        </button>

        {/* Visual Pulse Orb */}
        <div className="flex items-center gap-1.5">
          <div
            className={`w-3.5 h-3.5 rounded-full transition-transform duration-75 ${
              isActive
                ? beatPulse
                  ? 'bg-emerald-500 scale-130 shadow-md shadow-emerald-400'
                  : 'bg-emerald-200 scale-100'
                : 'bg-slate-200'
            }`}
          />
          <span className="text-[11px] font-mono text-slate-500 font-semibold">
            {targetWpm} WPM Pace
          </span>
        </div>
      </div>

      {/* Center: Target WPM Slider */}
      <div className="flex items-center gap-2 flex-1 max-w-xs min-w-[180px]">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target:</span>
        <input
          type="range"
          min={20}
          max={100}
          step={5}
          value={targetWpm}
          onChange={(e) => setTargetWpm(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <span className="font-mono font-bold text-slate-700 w-8 text-right">
          {targetWpm}
        </span>
      </div>

      {/* Right: Audio Toggle & Live Pace Status */}
      <div className="flex items-center gap-3">
        {isTyping && currentWpm > 0 && (
          <div
            className={`px-2.5 py-1 rounded-xl font-bold text-[11px] flex items-center gap-1 ${
              Math.abs(delta) <= 5
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : delta > 5
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <Activity className="w-3 h-3 shrink-0" />
            <span>
              {Math.abs(delta) <= 5
                ? '🎯 In Cadence'
                : delta > 0
                ? `⚡ +${delta} WPM`
                : `🐢 ${delta} WPM`}
            </span>
          </div>
        )}

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            soundEnabled
              ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
          }`}
          title={soundEnabled ? 'Mute metronome clicks' : 'Enable metronome clicks'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
