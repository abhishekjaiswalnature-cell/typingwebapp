/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { LESSONS } from './services/lessonsData';
import { DEFAULT_USERS } from './services/userService';
import { TypingEngine, TypingEngineState } from './services/typingEngine';
import { audioEngine } from './services/audioEngine';
import { coordinateRegistry } from './services/coordinateRegistry';
import { WeakKeyService } from './services/weakKeyService';
import { StreakService, StreakState } from './services/streakService';
import { UserPreferences, Lesson, TypingAnimationEvent, UserProfile } from './types/typing';

import { TopBar } from './components/TopBar';
import { LessonDisplay } from './components/LessonDisplay';
import { RhythmFlowMeter } from './components/RhythmFlowMeter';
import { RhythmMetronome } from './components/RhythmMetronome';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { VirtualHands } from './components/VirtualHands';
import { ParticleCanvas, ParticleCanvasHandle } from './components/ParticleCanvas';
import { LessonIntroductionModal } from './components/LessonIntroductionModal';
import { CompletionModal } from './components/CompletionModal';
import { LessonSelectorModal } from './components/LessonSelectorModal';
import { SettingsModal } from './components/SettingsModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SpeedTestModal } from './components/SpeedTestModal';
import { HindiCharMapModal } from './components/HindiCharMapModal';
import { KeyboardHeatmapModal } from './components/KeyboardHeatmapModal';
import { Layers, HandMetal, HelpCircle, CheckCircle2 } from 'lucide-react';

const PREFERENCES_STORAGE_KEY = 'kinesis_typing_preferences_v2';
const USER_STORAGE_KEY = 'kinesis_typing_user_v2';

const DEFAULT_PREFERENCES: UserPreferences = {
  errorMode: 'ignore', // Default: never block, smooth continuous flow
  switchSound: 'cherry_blue',
  volume: 0.5,
  speedAdaptiveAnimation: true,
  showHands: true,
  showKeyboardZones: true,
  showRhythmGauge: true,
  reducedMotion: false,
  keyboardLayout: 'qwerty',
};

export default function App() {
  // Load preferences from localStorage
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    try {
      const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (saved) return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
    } catch {
      // Fallback
    }
    return DEFAULT_PREFERENCES;
  });

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Fallback
      }
      return next;
    });
  };

  // User Profile state
  const [users, setUsers] = useState<UserProfile[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    if (typeof window === 'undefined') return DEFAULT_USERS[0];
    try {
      const savedId = localStorage.getItem(USER_STORAGE_KEY);
      if (savedId) {
        const found = DEFAULT_USERS.find((u) => u.id === savedId);
        if (found) return found;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_USERS[0];
  });

  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(USER_STORAGE_KEY, user.id);
    } catch {
      // Fallback
    }
  };

  // Sync audio engine with preferences
  useEffect(() => {
    audioEngine.setSoundType(preferences.switchSound);
    audioEngine.setVolume(preferences.volume);
  }, [preferences.switchSound, preferences.volume]);

  // Current Lesson
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [customLesson, setCustomLesson] = useState<Lesson | null>(null);

  const activeLesson: Lesson = useMemo(() => {
    return customLesson || LESSONS[currentLessonIndex] || LESSONS[0];
  }, [customLesson, currentLessonIndex]);

  // Modals state
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showLessonSelector, setShowLessonSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSpeedTest, setShowSpeedTest] = useState(false);
  const [showHindiMap, setShowHindiMap] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Daily Streak state with localStorage persistence
  const [streak, setStreak] = useState<StreakState>(() =>
    StreakService.getStreak(currentUser.id, currentUser.stats.streakDays)
  );
  const [isCelebratingStreakGoal, setIsCelebratingStreakGoal] = useState(false);

  // Sync streak when active user profile switches
  useEffect(() => {
    setStreak(StreakService.getStreak(currentUser.id, currentUser.stats.streakDays));
  }, [currentUser.id]);

  const handleUpdateStreakGoal = (newGoal: number) => {
    const updated = StreakService.setDailyGoal(newGoal, currentUser.id);
    setStreak(updated);
    setToastMessage(`🎯 Daily practice target set to ${newGoal} lesson${newGoal > 1 ? 's' : ''}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Animation & Visual interaction states (ephemeral)
  const [activePressedCodes, setActivePressedCodes] = useState<Set<string>>(new Set());
  const [correctCodes, setCorrectCodes] = useState<Set<string>>(new Set());
  const [errorCodes, setErrorCodes] = useState<Set<string>>(new Set());
  const [isSlowdown, setIsSlowdown] = useState(false);

  // Particle canvas reference
  const particleCanvasRef = useRef<ParticleCanvasHandle | null>(null);

  // Typing Engine instance
  const engineRef = useRef<TypingEngine | null>(null);
  const [engineState, setEngineState] = useState<TypingEngineState>(() => {
    const isHindi = Boolean(activeLesson.language === 'hi' || /[\u0900-\u097F]/.test(activeLesson.content));
    const engine = new TypingEngine(activeLesson.id, activeLesson.content, preferences.errorMode, isHindi);
    engineRef.current = engine;
    return engine.getState();
  });

  // Re-initialize engine when active lesson changes or error mode changes
  const resetCurrentLesson = useCallback(() => {
    if (!engineRef.current) return;
    const isHindi = Boolean(activeLesson.language === 'hi' || /[\u0900-\u097F]/.test(activeLesson.content));
    engineRef.current.initLesson(activeLesson.id, activeLesson.content, preferences.errorMode, isHindi);
    setActivePressedCodes(new Set());
    setCorrectCodes(new Set());
    setErrorCodes(new Set());
    setIsSlowdown(false);
    setShowCompletionModal(false);
  }, [activeLesson, preferences.errorMode]);

  useEffect(() => {
    resetCurrentLesson();
  }, [resetCurrentLesson]);

  // Update error mode on engine if changed in settings
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setErrorMode(preferences.errorMode);
    }
  }, [preferences.errorMode]);

  // Handle animation events emitted by typing engine
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const unsubscribeState = engine.subscribeState((state) => {
      setEngineState(state);
    });

    const unsubscribeAnim = engine.subscribeAnimation((event: TypingAnimationEvent) => {
      switch (event.type) {
        case 'keyDown': {
          audioEngine.playKeyDown(false);
          setActivePressedCodes((prev) => new Set(prev).add(event.code));
          setTimeout(() => {
            setActivePressedCodes((prev) => {
              const next = new Set(prev);
              next.delete(event.code);
              return next;
            });
          }, 110);
          break;
        }

        case 'keyCorrect': {
          audioEngine.playKeyDown(false);
          setIsSlowdown(false);

          // Record performance in weak-key service
          WeakKeyService.recordKeystroke(currentUser.id, event.expected, true, event.delayFromPreviousMs);

          setActivePressedCodes((prev) => new Set(prev).add(event.code));
          setCorrectCodes((prev) => new Set(prev).add(event.code));

          setTimeout(() => {
            setActivePressedCodes((prev) => {
              const next = new Set(prev);
              next.delete(event.code);
              return next;
            });
            setCorrectCodes((prev) => {
              const next = new Set(prev);
              next.delete(event.code);
              return next;
            });
          }, 130);

          if (engine.getState().metrics.currentStreak % 15 === 0 && particleCanvasRef.current) {
            const rect = coordinateRegistry.getKeyRect(event.code);
            if (rect) {
              const containerDim = coordinateRegistry.getContainerDimensions();
              particleCanvasRef.current.burst(
                window.innerWidth / 2 + (rect.x - containerDim.width / 2),
                window.innerHeight * 0.65,
                '#059669',
                12
              );
            }
          }
          break;
        }

        case 'keyError': {
          audioEngine.playKeyDown(true);

          // Record error in weak-key service
          WeakKeyService.recordKeystroke(currentUser.id, event.expected, false, event.delayFromPreviousMs);

          setErrorCodes((prev) => new Set(prev).add(event.code));
          setTimeout(() => {
            setErrorCodes((prev) => {
              const next = new Set(prev);
              next.delete(event.code);
              return next;
            });
          }, 260);
          break;
        }

        case 'slowdown': {
          setIsSlowdown(true);
          break;
        }

        case 'lessonComplete': {
          audioEngine.playSuccessChime();
          if (particleCanvasRef.current) {
            particleCanvasRef.current.celebrate();
          }

          // Update user statistics on lesson completion
          const finalMetrics = engine.calculateMetrics();

          // Save error session stats
          WeakKeyService.recordSessionErrors(
            currentUser.id,
            finalMetrics.keyErrors,
            finalMetrics.totalKeystrokes
          );

          // Update persistent Daily Streak & Check Goal
          const streakResult = StreakService.recordLessonCompleted(currentUser.id);
          setStreak(streakResult.state);

          if (streakResult.justHitGoal) {
            // Trigger visual flame animation & fanfare
            setIsCelebratingStreakGoal(true);
            audioEngine.playStreakGoalFanfare();
            setToastMessage(`🔥 Daily Goal Achieved! ${streakResult.state.currentStreak}-Day Streak Secured!`);
            setTimeout(() => {
              setIsCelebratingStreakGoal(false);
            }, 4500);
          } else if (streakResult.streakIncreased) {
            setToastMessage(`🔥 Daily Streak: ${streakResult.state.currentStreak} Days!`);
            setTimeout(() => setToastMessage(null), 3500);
          }

          setCurrentUser((prev) => {
            const nextBest = Math.max(prev.stats.bestWpm, finalMetrics.wpm);
            const total = prev.stats.totalCompletedLessons + 1;
            const updatedAcc = Math.round(
              (prev.stats.averageAccuracy * prev.stats.totalCompletedLessons + finalMetrics.accuracy) / total
            );
            const completedSet = new Set(prev.stats.completedLessonIds);
            completedSet.add(activeLesson.id);

            const updatedUser: UserProfile = {
              ...prev,
              stats: {
                ...prev.stats,
                totalCompletedLessons: total,
                bestWpm: nextBest,
                averageAccuracy: updatedAcc,
                completedLessonIds: Array.from(completedSet),
                streakDays: streakResult.state.currentStreak,
              },
            };

            setUsers((prevUsers) =>
              prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            );

            return updatedUser;
          });

          setTimeout(() => {
            setShowCompletionModal(true);
          }, 450);
          break;
        }
      }
    });

    return () => {
      unsubscribeState();
      unsubscribeAnim();
    };
  }, [activeLesson.id, currentUser.id]);

  // Physical Keyboard input listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showIntroModal) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setShowIntroModal(false);
        }
        return;
      }

      if (
        showCompletionModal ||
        showLessonSelector ||
        showSettings ||
        showProfileModal ||
        showSpeedTest ||
        showHindiMap ||
        showHeatmap
      ) {
        if (e.key === 'Escape') {
          setShowCompletionModal(false);
          setShowLessonSelector(false);
          setShowSettings(false);
          setShowProfileModal(false);
          setShowSpeedTest(false);
          setShowHindiMap(false);
          setShowHeatmap(false);
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        resetCurrentLesson();
        return;
      }

      if (['Space', 'Backspace', 'Tab'].includes(e.code)) {
        e.preventDefault();
      }

      if (!engineRef.current) return;
      engineRef.current.handleKeyDown(e.key, e.code, e.shiftKey);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      audioEngine.playKeyUp();
      setActivePressedCodes((prev) => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    showIntroModal,
    showCompletionModal,
    showLessonSelector,
    showSettings,
    showProfileModal,
    showSpeedTest,
    showHindiMap,
    showHeatmap,
    resetCurrentLesson,
  ]);

  const handleVirtualKeyClick = (key: string, code: string) => {
    if (
      !engineRef.current ||
      showIntroModal ||
      showCompletionModal ||
      showSpeedTest ||
      showHindiMap ||
      showHeatmap
    )
      return;
    engineRef.current.handleKeyDown(key, code, false);
  };

  const handleNextLesson = () => {
    if (customLesson) {
      setCustomLesson(null);
      setShowCompletionModal(false);
      resetCurrentLesson();
      return;
    }
    if (currentLessonIndex < LESSONS.length - 1) {
      const nextIdx = currentLessonIndex + 1;
      const nextLesson = LESSONS[nextIdx];
      setCurrentLessonIndex(nextIdx);
      setShowCompletionModal(false);
      setShowIntroModal(false);
      if (nextLesson.language === 'hi') {
        updatePreferences({ keyboardLayout: 'hindi-inscript' });
      } else {
        updatePreferences({ keyboardLayout: 'qwerty' });
      }
      setToastMessage(`✓ Opened: "${nextLesson.title}" · Begin typing!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleSelectCurriculumLesson = (lesson: Lesson) => {
    setCustomLesson(null);
    const index = LESSONS.findIndex((l) => l.id === lesson.id);
    if (index !== -1) {
      setCurrentLessonIndex(index);
    } else {
      // If generated or not in standard index
      setCustomLesson(lesson);
    }
    setShowLessonSelector(false);
    setShowIntroModal(false);
    if (lesson.language === 'hi') {
      updatePreferences({ keyboardLayout: 'hindi-inscript' });
    } else {
      updatePreferences({ keyboardLayout: 'qwerty' });
    }
    setToastMessage(`✓ Opened: "${lesson.title}" · Ready to type!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectCustomText = (text: string, title: string) => {
    const isHindi = /[\u0900-\u097F]/.test(text);
    const isPara = text.length > 80 || text.includes('\n');
    const custom: Lesson = {
      id: `custom-${Date.now()}`,
      stage: 99,
      title,
      category: isPara ? 'Paragraphs' : isHindi ? 'Hindi Typing' : 'Custom Drill',
      description: 'Custom text practice session.',
      targetKeys: Array.from(new Set(text.toLowerCase().split(''))).slice(0, 8),
      content: text,
      difficulty: 'intermediate',
      isParagraph: isPara,
      language: isHindi ? 'hi' : 'en',
    };
    setCustomLesson(custom);
    setShowLessonSelector(false);
    setShowIntroModal(false);
    if (isHindi) {
      updatePreferences({ keyboardLayout: 'hindi-inscript' });
    }
    setToastMessage(`✓ Custom exercise loaded: "${title}" · Ready to type!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePracticeWeakKeys = (specificKeys?: string[]) => {
    const lang = activeLesson.language === 'hi' ? 'hi' : 'en';
    let targetKeys = specificKeys && specificKeys.length > 0 ? specificKeys : [];

    if (targetKeys.length === 0) {
      const detected = WeakKeyService.getWeakKeys(currentUser.id, lang, 4);
      targetKeys = detected.map((k) => k.char);
    }

    const drill = WeakKeyService.generate1to4ProgressiveDrill(targetKeys, lang);
    setCustomLesson(drill);
    setShowCompletionModal(false);
    if (lang === 'hi') {
      updatePreferences({ keyboardLayout: 'hindi-inscript' });
    }
    setToastMessage(`🎯 1-to-4 Weak-Key Remediation Drill Generated!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartCustomLessonFromModal = (lesson: Lesson) => {
    setCustomLesson(lesson);
    if (lesson.language === 'hi') {
      updatePreferences({ keyboardLayout: 'hindi-inscript' });
    }
    setToastMessage(`✓ Started: "${lesson.title}"`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentTargetChar = engineRef.current?.getTargetChar() || '';
  const nextTargetChar = engineRef.current?.getNextTargetChar() || '';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-emerald-200">
      <ParticleCanvas
        ref={particleCanvasRef}
        reducedMotion={preferences.reducedMotion}
      />

      {/* Top Navigation Bar with Light Styling & Rich Tooling */}
      <TopBar
        activeLessonTitle={activeLesson.title}
        currentUser={currentUser}
        switchSound={preferences.switchSound}
        onToggleSound={() =>
          updatePreferences({
            switchSound:
              preferences.switchSound === 'off'
                ? 'cherry_blue'
                : preferences.switchSound === 'cherry_blue'
                ? 'cherry_red'
                : preferences.switchSound === 'cherry_red'
                ? 'topre'
                : 'off',
          })
        }
        onOpenLessons={() => setShowLessonSelector(true)}
        onOpenSpeedTest={() => setShowSpeedTest(true)}
        onOpenWeakKeys={() => handlePracticeWeakKeys()}
        onOpenHindiMap={() => setShowHindiMap(true)}
        onOpenHeatmap={() => setShowHeatmap(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onResetLesson={resetCurrentLesson}
        isHindiLesson={Boolean(activeLesson.language === 'hi' || /[\u0900-\u097F]/.test(activeLesson.content))}
        keyboardLayout={preferences.keyboardLayout}
        onToggleLayout={() =>
          updatePreferences({
            keyboardLayout: preferences.keyboardLayout === 'hindi-inscript' ? 'qwerty' : 'hindi-inscript',
          })
        }
        streak={streak}
        onUpdateStreakGoal={handleUpdateStreakGoal}
        isCelebratingStreakGoal={isCelebratingStreakGoal}
      />

      {/* Instant Action Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-fade-in pointer-events-none">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Kinetic Typing Stage */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-5 sm:py-7 gap-4 sm:gap-6 max-w-6xl mx-auto w-full">
        {/* Lesson Breadcrumb & Controls */}
        <div className="w-full max-w-5xl flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Stage {activeLesson.stage} · {activeLesson.category}
            </span>
            {activeLesson.isParagraph && (
              <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-bold border border-sky-200 text-[10px]">
                Paragraph
              </span>
            )}
            {activeLesson.language === 'hi' && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200 text-[10px]">
                हिन्दी InScript
              </span>
            )}
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800 text-sm">{activeLesson.title}</span>

            {/* Optional Finger Guide button */}
            <button
              onClick={() => setShowIntroModal(true)}
              className="ml-1 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2 py-0.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="View finger placement guide for this lesson"
            >
              <HelpCircle className="w-3 h-3 text-slate-400" />
              <span>Guide</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => updatePreferences({ showKeyboardZones: !preferences.showKeyboardZones })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                preferences.showKeyboardZones
                  ? 'bg-white text-emerald-700 border border-emerald-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 bg-slate-100'
              }`}
              title="Toggle color-coded finger zones"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Zones</span>
            </button>

            <button
              onClick={() => updatePreferences({ showHands: !preferences.showHands })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                preferences.showHands
                  ? 'bg-white text-emerald-700 border border-emerald-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 bg-slate-100'
              }`}
              title="Toggle kinetic biomechanical hands"
            >
              <HandMetal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hands</span>
            </button>
          </div>
        </div>

        {/* Real-time Rhythm & Flow Meter */}
        <RhythmFlowMeter
          metrics={engineState.metrics}
          isSlowdown={isSlowdown}
        />

        {/* Real-time Rhythm Metronome & Pacer Bar */}
        <RhythmMetronome
          currentWpm={engineState.metrics.wpm}
          isTyping={engineState.isStarted && !engineState.isCompleted}
        />

        {/* Bigger, High-Legibility Lesson Display (with Blank Space for spaces) */}
        <LessonDisplay
          characters={engineState.characters}
          cursorIndex={engineState.cursorIndex}
          errorMode={preferences.errorMode}
          errorStackLength={engineState.errorStackLength}
          isSlowdown={isSlowdown}
        />

        {/* Virtual Keyboard & Hand Guidance Stage */}
        <div className="relative w-full max-w-5xl mt-1 pb-4">
          <VirtualKeyboard
            targetChar={currentTargetChar}
            activePressedCodes={activePressedCodes}
            errorCodes={errorCodes}
            correctCodes={correctCodes}
            showZones={preferences.showKeyboardZones}
            onKeyClick={handleVirtualKeyClick}
            speedWpm={engineState.metrics.wpm}
            layoutMode={preferences.keyboardLayout}
          />

          {/* Kinetic Articulated Hands Overlay */}
          <VirtualHands
            targetChar={currentTargetChar}
            nextChar={nextTargetChar}
            activePressedCodes={activePressedCodes}
            typingSpeedWpm={preferences.speedAdaptiveAnimation ? engineState.metrics.wpm : 40}
            reducedMotion={preferences.reducedMotion}
            showHands={preferences.showHands}
          />
        </div>

        {/* Footer info bar */}
        <footer className="w-full max-w-5xl flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span>Esc to restart</span>
            <span aria-hidden="true">·</span>
            <span>Target keys illuminate with touch-typing finger colors</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Continuous Kinetic Engine</span>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <LessonIntroductionModal
        lesson={activeLesson}
        isOpen={showIntroModal}
        onStart={() => setShowIntroModal(false)}
        onClose={() => setShowIntroModal(false)}
      />

      <CompletionModal
        isOpen={showCompletionModal}
        metrics={engineState.metrics}
        lessonTitle={activeLesson.title}
        hasNextLesson={currentLessonIndex < LESSONS.length - 1 || Boolean(customLesson)}
        onNextLesson={handleNextLesson}
        onPracticeWeakKeys={(keys) => handlePracticeWeakKeys(keys)}
        onOpenHeatmap={() => {
          setShowCompletionModal(false);
          setShowHeatmap(true);
        }}
        onRetryLesson={() => {
          setShowCompletionModal(false);
          resetCurrentLesson();
        }}
        onClose={() => {
          setShowCompletionModal(false);
          setShowLessonSelector(true);
        }}
        dailyStreak={streak}
      />

      <LessonSelectorModal
        isOpen={showLessonSelector}
        activeLessonId={activeLesson.id}
        onSelectLesson={handleSelectCurriculumLesson}
        onSelectCustomText={handleSelectCustomText}
        onClose={() => setShowLessonSelector(false)}
      />

      <SpeedTestModal
        isOpen={showSpeedTest}
        currentUser={currentUser}
        onClose={() => setShowSpeedTest(false)}
        onStartCustomLesson={handleStartCustomLessonFromModal}
      />

      <HindiCharMapModal
        isOpen={showHindiMap}
        onClose={() => setShowHindiMap(false)}
        onStartCustomLesson={handleStartCustomLessonFromModal}
      />

      <KeyboardHeatmapModal
        isOpen={showHeatmap}
        currentUser={currentUser}
        onClose={() => setShowHeatmap(false)}
        onStartCustomLesson={handleStartCustomLessonFromModal}
      />

      <SettingsModal
        isOpen={showSettings}
        preferences={preferences}
        onUpdatePreferences={updatePreferences}
        onClose={() => setShowSettings(false)}
      />

      <UserProfileModal
        isOpen={showProfileModal}
        users={users}
        currentUserId={currentUser.id}
        onSelectUser={handleSelectUser}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
}
