export type Finger =
  | 'leftPinky'
  | 'leftRing'
  | 'leftMiddle'
  | 'leftIndex'
  | 'leftThumb'
  | 'rightThumb'
  | 'rightIndex'
  | 'rightMiddle'
  | 'rightRing'
  | 'rightPinky';

export type Hand = 'left' | 'right';

export type KeyboardLayoutMode = 'qwerty' | 'hindi-inscript' | 'inscript_hindi' | 'remington_hindi';

export type TypingAnimationEventType =
  | 'keyDown'
  | 'keyCorrect'
  | 'keyError'
  | 'cursorAdvance'
  | 'characterComplete'
  | 'lessonComplete'
  | 'slowdown';

export interface TypingAnimationEvent {
  id: number;
  timestamp: number;
  code: string;
  key: string;
  expected: string;
  actual: string;
  correct: boolean;
  cursorIndex: number;
  finger?: Finger;
  hand?: Hand;
  delayFromPreviousMs?: number;
  type: TypingAnimationEventType;
}

export type ErrorMode = 'ignore' | 'require_backspace' | 'block_until_correct';

export type SwitchSound = 'cherry_blue' | 'cherry_red' | 'topre' | 'off';

export interface KeyDefinition {
  code: string;
  label: string;
  shiftLabel?: string;
  finger: Finger;
  hand: Hand;
  row: number; // 0 to 4
  widthUnit: number; // 1 = standard key, 1.5 = tab, 1.75 = caps, 2.25 = enter, 6.25 = space
  homeKey?: boolean;
  bump?: boolean; // F and J
}

export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'master';
export type LessonCategoryType = 'drills' | 'paragraph' | 'hindi';

export interface Lesson {
  id: string;
  title: string;
  stage: number;
  category: string;
  description: string;
  targetKeys: string[];
  primaryFinger?: Finger;
  content: string;
  difficulty: LessonDifficulty;
  isParagraph?: boolean;
  language?: 'en' | 'hi';
}

export interface TypingMetrics {
  wpm: number;
  netWpm: number;
  accuracy: number;
  cpm: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  errorKeystrokes: number;
  elapsedSeconds: number;
  rhythmConsistency: number; // 0 to 100%
  currentStreak: number;
  bestStreak: number;
  keyErrors: Record<string, number>;
  fingerErrors: Record<Finger, number>;
  keystrokeDeltas: number[];
}

export interface UserPreferences {
  errorMode: ErrorMode;
  switchSound: SwitchSound;
  volume: number; // 0 to 1
  speedAdaptiveAnimation: boolean;
  showHands: boolean;
  showKeyboardZones: boolean;
  showRhythmGauge: boolean;
  reducedMotion: boolean;
  keyboardLayout: KeyboardLayoutMode;
}

export interface UserStats {
  totalCompletedLessons: number;
  bestWpm: number;
  averageAccuracy: number;
  completedLessonIds: string[];
  streakDays: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  createdAt: number;
  stats: UserStats;
}
