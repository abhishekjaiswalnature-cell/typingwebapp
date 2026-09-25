import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Timer,
  Award,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Play,
  Printer,
  Copy,
  Check,
  Globe,
  Sparkles,
  Target,
} from 'lucide-react';
import { Lesson, TypingMetrics, UserProfile } from '../types/typing';
import { TypingEngine, TypingEngineState } from '../services/typingEngine';
import { audioEngine } from '../services/audioEngine';
import { WeakKeyService } from '../services/weakKeyService';

interface SpeedTestModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onStartCustomLesson: (lesson: Lesson) => void;
}

const TEST_PASSAGES = {
  en: [
    {
      title: 'Digital Horizons & Global Network',
      content:
        'The rapid advancement of computational systems has transformed modern communication into an intricate global tapestry. As information traverses optic fibers across continents in fractions of a second, communities around the planet discover unprecedented avenues for collaboration, scientific discovery, and creative expression. Cultivating disciplined focus and accurate dexterity allows us to articulate our thoughts cleanly into this digital continuum.',
    },
    {
      title: 'The Architecture of Thought',
      content:
        'Clarity of expression is fundamentally linked to the swiftness and precision with which ideas are rendered into text. When fingers glide effortlessly across a keyboard without conscious hesitation, the cognitive barrier between imagination and execution vanishes. In this tranquil state of creative momentum, complex problems dissolve into structured, elegant prose.',
    },
  ],
  hi: [
    {
      title: 'भारत का संविधान एवं नागरिक संकल्प',
      content:
        'हम भारत के लोग, भारत को एक संपूर्ण प्रभुत्व-संपन्न, समाजवादी, पंथनिरपेक्ष, लोकतंत्रात्मक गणराज्य बनाने के लिए तथा उसके समस्त नागरिकों को सामाजिक, आर्थिक और राजनैतिक न्याय, विचार, अभिव्यक्ति, विश्वास, धर्म और उपासना की स्वतंत्रता, प्रतिष्ठा और अवसर की समता प्राप्त कराने के लिए दृढ़संकल्प होकर अपनी इस संविधान सभा में इसे अंगीकृत करते हैं।',
    },
    {
      title: 'परिश्रम और सफलता का मार्ग',
      content:
        'जीवन में सफलता का कोई सरल मार्ग नहीं होता। निरंतर लगन, धैर्य और नियमित अभ्यास से कठिन से कठिन कार्य भी सुगम हो जाते हैं। जब मनुष्य अपने लक्ष्य के प्रति समर्पित होकर कार्य करता है, तब मार्ग की सभी बाधाएं दूर होने लगती हैं और एक नवीन आत्मविश्वास का संचार होता है।',
    },
  ],
};

export const SpeedTestModal: React.FC<SpeedTestModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onStartCustomLesson,
}) => {
  const [durationMinutes, setDurationMinutes] = useState<number>(1);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [passageIndex, setPassageIndex] = useState(0);

  // Exam phase: 'setup' | 'running' | 'completed'
  const [phase, setPhase] = useState<'setup' | 'running' | 'completed'>('setup');
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [copiedCertificate, setCopiedCertificate] = useState(false);

  // Engine for the speed test
  const engineRef = useRef<TypingEngine | null>(null);
  const [engineState, setEngineState] = useState<TypingEngineState | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activePassage = TEST_PASSAGES[language][passageIndex % TEST_PASSAGES[language].length];

  // Initialize test
  const startTest = () => {
    const totalSeconds = durationMinutes * 60;
    setTimeLeft(totalSeconds);

    const isHi = language === 'hi';
    const engine = new TypingEngine(
      `exam-${Date.now()}`,
      activePassage.content,
      'ignore',
      isHi
    );
    engineRef.current = engine;
    setEngineState(engine.getState());

    engine.subscribeState((state) => {
      setEngineState(state);
      if (state.isCompleted) {
        finishTest();
      }
    });

    setPhase('running');

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finishTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase('completed');
    audioEngine.playSuccessChime();

    // Record weak keys into service
    if (engineRef.current) {
      const metrics = engineRef.current.calculateMetrics();
      WeakKeyService.recordSessionErrors(
        currentUser.id,
        metrics.keyErrors,
        metrics.totalKeystrokes
      );
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Keyboard listener during running phase
  useEffect(() => {
    if (!isOpen || phase !== 'running') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        finishTest();
        return;
      }
      if (['Space', 'Backspace', 'Tab'].includes(e.code)) {
        e.preventDefault();
      }
      if (engineRef.current) {
        engineRef.current.handleKeyDown(e.key, e.code, e.shiftKey);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, phase]);

  if (!isOpen) return null;

  const currentMetrics = engineRef.current?.calculateMetrics() || {
    wpm: 0,
    netWpm: 0,
    accuracy: 100,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    errorKeystrokes: 0,
    elapsedSeconds: 0,
    rhythmConsistency: 100,
    currentStreak: 0,
    bestStreak: 0,
    cpm: 0,
    keyErrors: {},
    fingerErrors: {} as any,
    keystrokeDeltas: [],
  };

  // Official calculation:
  // Gross WPM = (Total Keystrokes / 5) / (Elapsed Minutes)
  // Net WPM = Gross WPM - (Errors / DurationMinutes)
  const elapsedMinutes = Math.max(0.1, (durationMinutes * 60 - timeLeft) / 60);
  const grossWpm = Math.round((currentMetrics.totalKeystrokes / 5) / elapsedMinutes);
  const officialNetWpm = Math.max(0, Math.round(grossWpm - (currentMetrics.errorKeystrokes / durationMinutes)));

  const getRank = (wpm: number) => {
    if (wpm >= 75) return { label: 'Grandmaster Typist', color: 'text-amber-500 bg-amber-50 border-amber-200' };
    if (wpm >= 55) return { label: 'Speed Virtuoso (High Distinction)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (wpm >= 40) return { label: 'Professional Typist (First Class)', color: 'text-sky-600 bg-sky-50 border-sky-200' };
    if (wpm >= 25) return { label: 'Proficient Typist (Pass)', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
    return { label: 'Developing Typist', color: 'text-slate-600 bg-slate-50 border-slate-200' };
  };

  const handleCopyCertificate = () => {
    const text = `🏆 OFFICIAL KINESIS TYPING TEST SCORECARD
Candidate: ${currentUser.name}
Language: ${language === 'hi' ? 'Hindi (InScript)' : 'English'}
Duration: ${durationMinutes} Minute(s)
Gross Speed: ${grossWpm} WPM
Net Official Speed: ${officialNetWpm} WPM
Accuracy: ${currentMetrics.accuracy}%
Total Errors: ${currentMetrics.errorKeystrokes}
Classification: ${getRank(officialNetWpm).label}
Issued: ${new Date().toLocaleDateString()}`;

    navigator.clipboard.writeText(text);
    setCopiedCertificate(true);
    setTimeout(() => setCopiedCertificate(false), 2500);
  };

  const handlePracticeWeakKeys = () => {
    const weakList = Object.keys(currentMetrics.keyErrors);
    const drill = WeakKeyService.generate1to4ProgressiveDrill(weakList, language);
    onStartCustomLesson(drill);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {phase === 'completed'
                  ? 'Official Typing Certificate'
                  : 'Timed Speed Certification Exam'}
              </h2>
              <p className="text-xs text-slate-500">
                Standard timed examination for Hindi and English speed testing
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

        {/* Phase 1: Setup */}
        {phase === 'setup' && (
          <div className="py-6 space-y-6">
            {/* Language Selection */}
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                1. Select Language
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLanguage('en')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    language === 'en'
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <Globe className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-bold text-sm">English Test</div>
                    <div className="text-xs text-slate-500">Standard QWERTY layout</div>
                  </div>
                </button>

                <button
                  onClick={() => setLanguage('hi')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    language === 'hi'
                      ? 'border-amber-500 bg-amber-50/50 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="font-bold text-lg text-amber-700">अ</span>
                  <div>
                    <div className="font-bold text-sm">हिन्दी Devanagari Test</div>
                    <div className="text-xs text-slate-500">Official InScript standard</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Test Duration */}
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                2. Test Duration
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[1, 2, 3, 5].map((m) => (
                  <button
                    key={m}
                    onClick={() => setDurationMinutes(m)}
                    className={`py-3 rounded-2xl border font-bold text-sm transition-all cursor-pointer ${
                      durationMinutes === m
                        ? 'border-emerald-500 bg-emerald-600 text-white shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                    }`}
                  >
                    {m} Min
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Passage Preview */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Exam Passage: {activePassage.title}</span>
                <button
                  onClick={() => setPassageIndex((prev) => prev + 1)}
                  className="text-emerald-700 hover:underline cursor-pointer"
                >
                  Change Passage
                </button>
              </div>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans">
                {activePassage.content}
              </p>
            </div>

            <button
              onClick={startTest}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Begin Official Speed Exam</span>
            </button>
          </div>
        )}

        {/* Phase 2: Running */}
        {phase === 'running' && engineState && (
          <div className="py-6 space-y-6">
            {/* Live Metrics Header */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Time Remaining:
                </span>
                <span className="font-mono text-2xl font-extrabold text-amber-600 tabular-nums">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div>
                  <span className="text-slate-400">Gross WPM: </span>
                  <span className="font-mono font-bold text-slate-800 text-base">{grossWpm}</span>
                </div>
                <div>
                  <span className="text-slate-400">Accuracy: </span>
                  <span className="font-mono font-bold text-emerald-600 text-base">
                    {currentMetrics.accuracy}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Errors: </span>
                  <span className="font-mono font-bold text-rose-600 text-base">
                    {currentMetrics.errorKeystrokes}
                  </span>
                </div>
              </div>
            </div>

            {/* Test Text Stream with Cursor */}
            <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-lg leading-relaxed max-h-56 overflow-y-auto select-none border border-slate-800">
              {engineState.characters.map((ch, idx) => {
                let color = 'text-slate-400';
                if (ch.status === 'correct') color = 'text-emerald-400';
                if (ch.status === 'incorrect') color = 'text-rose-400 bg-rose-950/60 rounded px-0.5';
                if (idx === engineState.cursorIndex) {
                  return (
                    <span
                      key={idx}
                      className="bg-emerald-500 text-slate-950 font-bold px-0.5 rounded shadow-sm animate-pulse"
                    >
                      {ch.char === ' ' ? '·' : ch.char}
                    </span>
                  );
                }
                return (
                  <span key={idx} className={color}>
                    {ch.char}
                  </span>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Type naturally. Esc to end test early and calculate certificate.</span>
              <button
                onClick={finishTest}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              >
                Submit Early
              </button>
            </div>
          </div>
        )}

        {/* Phase 3: Completed Certificate */}
        {phase === 'completed' && (
          <div className="py-5 space-y-6 animate-fade-in">
            {/* The Printable Certificate Container */}
            <div className="relative border-4 border-double border-amber-300 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 shadow-inner flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 mb-3 shadow-xs">
                <Award className="w-8 h-8" />
              </div>

              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
                Certificate of Typing Proficiency
              </span>

              <h3 className="text-2xl font-serif font-black text-slate-900 mt-1 mb-1">
                {currentUser.name}
              </h3>

              <p className="text-xs text-slate-500 max-w-sm mb-5">
                Has officially completed the {durationMinutes}-Minute{' '}
                {language === 'hi' ? 'Hindi InScript' : 'English'} Speed Examination.
              </p>

              {/* Core Scorecard Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mb-5">
                <div className="rounded-2xl bg-white border border-slate-200 p-3 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Net Speed
                  </span>
                  <span className="font-mono text-2xl font-black text-emerald-600">
                    {officialNetWpm}
                  </span>
                  <span className="text-[10px] text-slate-500 block">WPM</span>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-3 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Gross Speed
                  </span>
                  <span className="font-mono text-2xl font-black text-slate-800">
                    {grossWpm}
                  </span>
                  <span className="text-[10px] text-slate-500 block">WPM</span>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-3 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Accuracy
                  </span>
                  <span className="font-mono text-2xl font-black text-sky-600">
                    {currentMetrics.accuracy}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {currentMetrics.errorKeystrokes} errors
                  </span>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-3 shadow-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Keystrokes
                  </span>
                  <span className="font-mono text-2xl font-black text-purple-600">
                    {currentMetrics.totalKeystrokes}
                  </span>
                  <span className="text-[10px] text-slate-500 block">total</span>
                </div>
              </div>

              {/* Classification Badge */}
              <div
                className={`px-4 py-1.5 rounded-full border text-xs font-bold ${
                  getRank(officialNetWpm).color
                }`}
              >
                Classification: {getRank(officialNetWpm).label}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 w-full flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified by Kinesis Kinetic Engine</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setPhase('setup')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Take Another Test</span>
              </button>

              <div className="flex items-center gap-2">
                {Object.keys(currentMetrics.keyErrors).length > 0 && (
                  <button
                    onClick={handlePracticeWeakKeys}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Target className="w-4 h-4 text-amber-600" />
                    <span>Practice Test Errors (1-to-4)</span>
                  </button>
                )}

                <button
                  onClick={handleCopyCertificate}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer shadow-md transition-all"
                >
                  {copiedCertificate ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCertificate ? 'Scorecard Copied!' : 'Copy Scorecard'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
