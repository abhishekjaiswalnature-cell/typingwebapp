import {
  ErrorMode,
  Finger,
  Hand,
  TypingAnimationEvent,
  TypingAnimationEventType,
  TypingMetrics,
} from '../types/typing';
import { getCharMapping, getKeyDefinition, translateToInScriptHindi } from './keyboardMapping';

export type AnimationEventListener = (event: TypingAnimationEvent) => void;
export type StateChangeListener = (state: TypingEngineState) => void;

export interface CharacterState {
  char: string;
  status: 'future' | 'current' | 'correct' | 'incorrect';
  typedChar?: string;
  errorCount: number;
}

export interface TypingEngineState {
  lessonId: string;
  text: string;
  cursorIndex: number;
  characters: CharacterState[];
  isStarted: boolean;
  isCompleted: boolean;
  errorMode: ErrorMode;
  errorStackLength: number; // for require_backspace mode
  metrics: TypingMetrics;
}

export class TypingEngine {
  private text: string = '';
  private lessonId: string = '';
  private cursorIndex: number = 0;
  private characters: CharacterState[] = [];
  private isStarted: boolean = false;
  private isCompleted: boolean = false;
  private errorMode: ErrorMode = 'ignore';
  private errorStack: string[] = []; // for require_backspace

  private startTime: number = 0;
  private lastKeystrokeTime: number = 0;
  private keystrokeDeltas: number[] = [];

  private totalKeystrokes: number = 0;
  private correctKeystrokes: number = 0;
  private errorKeystrokes: number = 0;
  private currentStreak: number = 0;
  private bestStreak: number = 0;
  private keyErrors: Record<string, number> = {};
  private fingerErrors: Record<Finger, number> = {
    leftPinky: 0,
    leftRing: 0,
    leftMiddle: 0,
    leftIndex: 0,
    leftThumb: 0,
    rightThumb: 0,
    rightIndex: 0,
    rightMiddle: 0,
    rightRing: 0,
    rightPinky: 0,
  };

  private isHindiLesson: boolean = false;
  private eventIdCounter: number = 0;
  private animationListeners: Set<AnimationEventListener> = new Set();
  private stateListeners: Set<StateChangeListener> = new Set();

  constructor(lessonId: string = '', text: string = '', errorMode: ErrorMode = 'ignore', isHindi: boolean = false) {
    this.initLesson(lessonId, text, errorMode, isHindi);
  }

  public initLesson(lessonId: string, text: string, errorMode: ErrorMode = 'ignore', isHindi: boolean = false) {
    this.lessonId = lessonId;
    this.text = text;
    this.errorMode = errorMode;
    this.isHindiLesson = Boolean(isHindi || /[\u0900-\u097F]/.test(text));
    this.cursorIndex = 0;
    this.isStarted = false;
    this.isCompleted = false;
    this.errorStack = [];

    this.startTime = 0;
    this.lastKeystrokeTime = 0;
    this.keystrokeDeltas = [];

    this.totalKeystrokes = 0;
    this.correctKeystrokes = 0;
    this.errorKeystrokes = 0;
    this.currentStreak = 0;
    this.bestStreak = 0;
    this.keyErrors = {};
    this.fingerErrors = {
      leftPinky: 0,
      leftRing: 0,
      leftMiddle: 0,
      leftIndex: 0,
      leftThumb: 0,
      rightThumb: 0,
      rightIndex: 0,
      rightMiddle: 0,
      rightRing: 0,
      rightPinky: 0,
    };

    this.characters = text.split('').map((char, idx) => ({
      char,
      status: idx === 0 ? 'current' : 'future',
      errorCount: 0,
    }));

    this.notifyState();
  }

  public setErrorMode(mode: ErrorMode) {
    this.errorMode = mode;
    this.notifyState();
  }

  public subscribeAnimation(listener: AnimationEventListener): () => void {
    this.animationListeners.add(listener);
    return () => this.animationListeners.delete(listener);
  }

  public subscribeState(listener: StateChangeListener): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  private emitAnimationEvent(
    type: TypingAnimationEventType,
    code: string,
    key: string,
    expected: string,
    actual: string,
    correct: boolean,
    cursorIndex: number,
    finger?: Finger,
    hand?: Hand,
    delay?: number
  ) {
    const event: TypingAnimationEvent = {
      id: ++this.eventIdCounter,
      timestamp: performance.now(),
      code,
      key,
      expected,
      actual,
      correct,
      cursorIndex,
      finger,
      hand,
      delayFromPreviousMs: delay,
      type,
    };

    for (const listener of this.animationListeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in animation listener:', err);
      }
    }
  }

  private notifyState() {
    const state = this.getState();
    for (const listener of this.stateListeners) {
      try {
        listener(state);
      } catch (err) {
        console.error('Error in state listener:', err);
      }
    }
  }

  public getState(): TypingEngineState {
    return {
      lessonId: this.lessonId,
      text: this.text,
      cursorIndex: this.cursorIndex,
      characters: this.characters,
      isStarted: this.isStarted,
      isCompleted: this.isCompleted,
      errorMode: this.errorMode,
      errorStackLength: this.errorStack.length,
      metrics: this.calculateMetrics(),
    };
  }

  public getTargetChar(): string {
    if (this.cursorIndex < this.text.length) {
      return this.text[this.cursorIndex];
    }
    return '';
  }

  public getNextTargetChar(): string {
    if (this.cursorIndex + 1 < this.text.length) {
      return this.text[this.cursorIndex + 1];
    }
    return '';
  }

  // Handle standard keyboard input
  public handleKeyDown(key: string, code: string, shiftKey: boolean = false): boolean {
    if (this.isCompleted) return false;

    // Ignore pure modifier presses for character matching
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(key)) {
      const def = getKeyDefinition(code);
      this.emitAnimationEvent(
        'keyDown',
        code,
        key,
        this.getTargetChar(),
        key,
        true,
        this.cursorIndex,
        def?.finger,
        def?.hand
      );
      return false;
    }

    const now = performance.now();

    // Start timer on first keystroke
    if (!this.isStarted) {
      this.isStarted = true;
      this.startTime = now;
      this.lastKeystrokeTime = now;
    }

    const delta = this.lastKeystrokeTime > 0 ? now - this.lastKeystrokeTime : 0;
    this.lastKeystrokeTime = now;
    if (delta > 0 && delta < 5000) {
      this.keystrokeDeltas.push(delta);
    }

    // Check for slowdown indicator
    if (delta > 1400 && this.cursorIndex > 3) {
      const targetChar = this.getTargetChar();
      const mapping = getCharMapping(targetChar);
      this.emitAnimationEvent(
        'slowdown',
        code,
        key,
        targetChar,
        key,
        false,
        this.cursorIndex,
        mapping?.finger,
        mapping?.hand,
        delta
      );
    }

    // Handle Backspace
    if (key === 'Backspace') {
      this.handleBackspace(code, delta);
      return true;
    }

    // Single character input handling
    if (key.length === 1 || key === 'Enter') {
      let inputChar = key === 'Enter' ? '\n' : key;

      // InScript Hindi mapping support:
      // If typing in a Hindi lesson or targetChar is Devanagari ([\u0900-\u097F]):
      // If the incoming key is not already a Hindi character (i.e. user is typing on standard US/QWERTY layout),
      // translate code and shift state to the corresponding InScript Hindi character!
      const targetChar = this.getTargetChar();
      const isHindiTarget = this.isHindiLesson || /[\u0900-\u097F]/.test(targetChar);
      if (isHindiTarget && !/[\u0900-\u097F]/.test(inputChar)) {
        const hindiChar = translateToInScriptHindi(code, shiftKey);
        if (hindiChar !== null) {
          inputChar = hindiChar;
        }
      }

      this.processCharacterInput(inputChar, code, delta);
      return true;
    }

    return false;
  }

  private handleBackspace(code: string, delta: number) {
    this.totalKeystrokes++;
    const def = getKeyDefinition(code);
    this.emitAnimationEvent(
      'keyDown',
      code,
      'Backspace',
      this.getTargetChar(),
      'Backspace',
      true,
      this.cursorIndex,
      def?.finger,
      def?.hand,
      delta
    );

    if (this.errorMode === 'require_backspace' && this.errorStack.length > 0) {
      this.errorStack.pop();
      if (this.cursorIndex > 0) {
        this.cursorIndex--;
        const currentChar = this.characters[this.cursorIndex];
        if (currentChar) {
          currentChar.status = 'current';
          currentChar.typedChar = undefined;
        }
        if (this.characters[this.cursorIndex + 1]) {
          this.characters[this.cursorIndex + 1].status = 'future';
        }
      }
      this.notifyState();
    } else if (this.errorMode === 'ignore' && this.cursorIndex > 0) {
      this.cursorIndex--;
      if (this.characters[this.cursorIndex]) {
        this.characters[this.cursorIndex].status = 'current';
        this.characters[this.cursorIndex].typedChar = undefined;
      }
      if (this.characters[this.cursorIndex + 1]) {
        this.characters[this.cursorIndex + 1].status = 'future';
      }
      this.notifyState();
    }
  }

  private processCharacterInput(inputChar: string, code: string, delta: number) {
    const expectedChar = this.getTargetChar();
    const isCorrect = inputChar === expectedChar;
    const targetMapping = getCharMapping(expectedChar);
    const pressedDef = getKeyDefinition(code);

    const finger = pressedDef?.finger || targetMapping?.finger;
    const hand = pressedDef?.hand || targetMapping?.hand;

    this.totalKeystrokes++;

    if (isCorrect) {
      this.correctKeystrokes++;
      this.currentStreak++;
      if (this.currentStreak > this.bestStreak) {
        this.bestStreak = this.currentStreak;
      }

      // Mark character complete in authoritative engine
      if (this.characters[this.cursorIndex]) {
        this.characters[this.cursorIndex].status = 'correct';
        this.characters[this.cursorIndex].typedChar = inputChar;
      }

      // Emit keyCorrect event
      this.emitAnimationEvent(
        'keyCorrect',
        code,
        inputChar,
        expectedChar,
        inputChar,
        true,
        this.cursorIndex,
        finger,
        hand,
        delta
      );

      this.cursorIndex++;

      // Check for lesson completion
      if (this.cursorIndex >= this.text.length) {
        this.isCompleted = true;
        this.emitAnimationEvent(
          'lessonComplete',
          code,
          inputChar,
          expectedChar,
          inputChar,
          true,
          this.cursorIndex,
          finger,
          hand,
          delta
        );
      } else {
        // Advance current target
        if (this.characters[this.cursorIndex]) {
          this.characters[this.cursorIndex].status = 'current';
        }
        this.emitAnimationEvent(
          'cursorAdvance',
          code,
          inputChar,
          this.getTargetChar(),
          inputChar,
          true,
          this.cursorIndex,
          finger,
          hand,
          delta
        );
      }
    } else {
      // Incorrect input
      this.errorKeystrokes++;
      this.currentStreak = 0;

      // Track key and finger error stats
      this.keyErrors[expectedChar] = (this.keyErrors[expectedChar] || 0) + 1;
      if (targetMapping?.finger) {
        this.fingerErrors[targetMapping.finger] = (this.fingerErrors[targetMapping.finger] || 0) + 1;
      }

      if (this.characters[this.cursorIndex]) {
        this.characters[this.cursorIndex].errorCount++;
      }

      this.emitAnimationEvent(
        'keyError',
        code,
        inputChar,
        expectedChar,
        inputChar,
        false,
        this.cursorIndex,
        finger,
        hand,
        delta
      );

      if (this.errorMode === 'ignore') {
        // FREE / CONTINUOUS MODE (USER REQUEST: DO NOT FORCE TO BLOCK)
        // Incorrect character is logged, marked in red, and cursor advances naturally!
        if (this.characters[this.cursorIndex]) {
          this.characters[this.cursorIndex].status = 'incorrect';
          this.characters[this.cursorIndex].typedChar = inputChar;
        }
        this.cursorIndex++;
        if (this.cursorIndex >= this.text.length) {
          this.isCompleted = true;
          this.emitAnimationEvent(
            'lessonComplete',
            code,
            inputChar,
            expectedChar,
            inputChar,
            false,
            this.cursorIndex,
            finger,
            hand,
            delta
          );
        } else if (this.characters[this.cursorIndex]) {
          this.characters[this.cursorIndex].status = 'current';
          this.emitAnimationEvent(
            'cursorAdvance',
            code,
            inputChar,
            this.getTargetChar(),
            inputChar,
            false,
            this.cursorIndex,
            finger,
            hand,
            delta
          );
        }
      } else if (this.errorMode === 'require_backspace') {
        this.errorStack.push(inputChar);
        if (this.characters[this.cursorIndex]) {
          this.characters[this.cursorIndex].status = 'incorrect';
          this.characters[this.cursorIndex].typedChar = inputChar;
        }
        this.cursorIndex++;
        if (this.characters[this.cursorIndex]) {
          this.characters[this.cursorIndex].status = 'current';
        }
      } else if (this.errorMode === 'block_until_correct') {
        if (this.characters[this.cursorIndex]) {
          this.characters[this.cursorIndex].status = 'incorrect';
          setTimeout(() => {
            if (this.characters[this.cursorIndex]?.status === 'incorrect') {
              this.characters[this.cursorIndex].status = 'current';
              this.notifyState();
            }
          }, 250);
        }
      }
    }

    this.notifyState();
  }

  public calculateMetrics(): TypingMetrics {
    const now = performance.now();
    const elapsedMs = this.isStarted ? (this.isCompleted ? this.lastKeystrokeTime - this.startTime : now - this.startTime) : 0;
    const elapsedMinutes = Math.max(0.001, elapsedMs / 60000);
    const elapsedSeconds = Math.floor(elapsedMs / 1000);

    const wpm = Math.round((this.correctKeystrokes / 5) / elapsedMinutes);
    const netWpm = Math.max(0, Math.round(((this.correctKeystrokes - this.errorKeystrokes) / 5) / elapsedMinutes));
    const accuracy = this.totalKeystrokes > 0
      ? Math.max(0, Math.min(100, Math.round((this.correctKeystrokes / this.totalKeystrokes) * 100)))
      : 100;
    const cpm = Math.round(this.correctKeystrokes / elapsedMinutes);

    let rhythmConsistency = 100;
    if (this.keystrokeDeltas.length >= 4) {
      const mean = this.keystrokeDeltas.reduce((a, b) => a + b, 0) / this.keystrokeDeltas.length;
      const variance = this.keystrokeDeltas.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / this.keystrokeDeltas.length;
      const stdDev = Math.sqrt(variance);
      const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
      rhythmConsistency = Math.max(10, Math.min(100, Math.round(100 - cv * 0.75)));
    }

    return {
      wpm: isNaN(wpm) ? 0 : wpm,
      netWpm: isNaN(netWpm) ? 0 : netWpm,
      accuracy: isNaN(accuracy) ? 100 : accuracy,
      cpm: isNaN(cpm) ? 0 : cpm,
      totalKeystrokes: this.totalKeystrokes,
      correctKeystrokes: this.correctKeystrokes,
      errorKeystrokes: this.errorKeystrokes,
      elapsedSeconds,
      rhythmConsistency,
      currentStreak: this.currentStreak,
      bestStreak: this.bestStreak,
      keyErrors: { ...this.keyErrors },
      fingerErrors: { ...this.fingerErrors },
      keystrokeDeltas: [...this.keystrokeDeltas],
    };
  }
}
