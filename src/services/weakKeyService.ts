import { Lesson } from '../types/typing';

export interface KeyPerformance {
  char: string;
  attempts: number;
  errors: number;
  errorRate: number; // 0 to 1
  avgLatencyMs: number;
  lastTested: number;
}

const STORAGE_PREFIX = 'kinesis_weak_keys_v2';

export class WeakKeyService {
  private static getKeyStore(userId: string = 'default'): Record<string, KeyPerformance> {
    if (typeof window === 'undefined') return {};
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}_${userId}`);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return {};
  }

  private static saveKeyStore(userId: string = 'default', store: Record<string, KeyPerformance>) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}_${userId}`, JSON.stringify(store));
    } catch {
      // fallback
    }
  }

  /**
   * Record key stroke performance
   */
  public static recordKeystroke(
    userId: string,
    char: string,
    isCorrect: boolean,
    latencyMs: number = 0
  ) {
    if (!char || char.length > 2) return;
    const store = this.getKeyStore(userId);
    const key = char;

    const existing: KeyPerformance = store[key] || {
      char: key,
      attempts: 0,
      errors: 0,
      errorRate: 0,
      avgLatencyMs: 250,
      lastTested: Date.now(),
    };

    existing.attempts += 1;
    if (!isCorrect) {
      existing.errors += 1;
    }
    existing.errorRate = existing.attempts > 0 ? existing.errors / existing.attempts : 0;

    if (latencyMs > 0 && latencyMs < 5000) {
      // Exponential moving average for latency
      existing.avgLatencyMs = Math.round(existing.avgLatencyMs * 0.8 + latencyMs * 0.2);
    }
    existing.lastTested = Date.now();

    store[key] = existing;
    this.saveKeyStore(userId, store);
  }

  /**
   * Bulk record session errors
   */
  public static recordSessionErrors(
    userId: string,
    keyErrors: Record<string, number>,
    totalKeystrokes: number
  ) {
    const store = this.getKeyStore(userId);
    for (const [char, errorCount] of Object.entries(keyErrors)) {
      if (!char) continue;
      const existing: KeyPerformance = store[char] || {
        char,
        attempts: 0,
        errors: 0,
        errorRate: 0,
        avgLatencyMs: 350,
        lastTested: Date.now(),
      };
      existing.attempts += errorCount + 2;
      existing.errors += errorCount;
      existing.errorRate = existing.errors / existing.attempts;
      existing.lastTested = Date.now();
      store[char] = existing;
    }
    this.saveKeyStore(userId, store);
  }

  /**
   * Get list of top weak keys sorted by priority (errors + latency)
   */
  public static getWeakKeys(
    userId: string = 'default',
    language: 'en' | 'hi' = 'en',
    limit: number = 6
  ): KeyPerformance[] {
    const store = this.getKeyStore(userId);
    const isHindiRegex = /[\u0900-\u097F]/;

    const list = Object.values(store).filter((item) => {
      if (item.char === ' ' || item.char === '\n') return false;
      const isHi = isHindiRegex.test(item.char);
      return language === 'hi' ? isHi : !isHi;
    });

    // Score based on error count, error rate, and slow latency
    list.sort((a, b) => {
      const scoreA = a.errors * 3 + a.errorRate * 50 + (a.avgLatencyMs > 400 ? 5 : 0);
      const scoreB = b.errors * 3 + b.errorRate * 50 + (b.avgLatencyMs > 400 ? 5 : 0);
      return scoreB - scoreA;
    });

    return list.slice(0, limit);
  }

  /**
   * Generate an automated 1-to-4 progressive remediation drill for specified weak keys
   */
  public static generate1to4ProgressiveDrill(
    keysToPractice: string[],
    language: 'en' | 'hi' = 'en'
  ): Lesson {
    // If no keys provided, use standard anchors
    let keys = keysToPractice.filter((k) => k.trim().length > 0);
    if (keys.length === 0) {
      keys = language === 'hi' ? ['क', 'र', 'म', 'न'] : ['f', 'j', 'd', 'k'];
    }

    // Pad or trim to 4 keys
    const fallbackHindi = ['क', 'र', 'म', 'न', 'स', 'त', 'प', 'ल'];
    const fallbackEnglish = ['f', 'j', 'd', 'k', 's', 'l', 'a', 'e'];
    const pool = language === 'hi' ? fallbackHindi : fallbackEnglish;

    let index = 0;
    while (keys.length < 4) {
      const candidate = pool[index % pool.length];
      if (!keys.includes(candidate)) {
        keys.push(candidate);
      }
      index++;
    }

    const [k1, k2, k3, k4] = keys.slice(0, 4);

    // Build Step 1: 1 Alphabet Isolation & Rhythmic Repetition
    const step1 = `${k1} ${k1} ${k1} ${k1}${k1} ${k1}${k1} ${k1}${k1}${k1} ${k1}${k1}${k1} ${k1} ${k1}${k1} ${k1}${k1}${k1} ${k1} ${k1} ${k1}${k1}`;

    // Build Step 2: 2 Alphabets Pairing & Alternating Flow
    const step2 = `${k2} ${k2} ${k1} ${k2} ${k1}${k2} ${k1}${k2} ${k2}${k1} ${k2}${k1} ${k1}${k1} ${k2}${k2} ${k1}${k2}${k1}${k2} ${k2}${k1}${k2}${k1} ${k1}${k2} ${k2}${k1}`;

    // Build Step 3: 3 Alphabets Tri-Key Permutation & Word Rhythms
    const step3 = `${k3} ${k3} ${k1}${k3} ${k2}${k3} ${k3}${k1} ${k3}${k2} ${k1}${k2}${k3} ${k3}${k2}${k1} ${k2}${k1}${k3} ${k1}${k3}${k2} ${k1}${k2}${k3} ${k3}${k1}${k2}`;

    // Build Step 4: 4 Alphabets Quad-Key Consolidated Cadence
    const step4 = `${k4} ${k4} ${k1}${k4} ${k2}${k4} ${k3}${k4} ${k4}${k1} ${k4}${k2} ${k4}${k3} ${k1}${k2}${k3}${k4} ${k4}${k3}${k2}${k1} ${k2}${k1}${k4}${k3} ${k3}${k4}${k1}${k2} ${k1}${k4}${k2}${k3} ${k4}${k2}${k3}${k1}`;

    const fullContent = `${step1} ${step2} ${step3} ${step4}`;

    return {
      id: `weak-drill-${Date.now()}`,
      stage: 90,
      title: `Smart Drill: 1-to-4 Focus (${keys.slice(0, 4).join(', ')})`,
      category: 'Weak-Key Remediation',
      description: `Targeted 1-to-4 motor drill generated from your keystroke history. Isolates ${k1}, expands to pairs (${k1}, ${k2}), triplets (${k1}, ${k2}, ${k3}), and quad-flow.`,
      targetKeys: [...keys.slice(0, 4), ' '],
      content: fullContent,
      difficulty: 'intermediate',
      language,
    };
  }

  /**
   * Reset stats for a user
   */
  public static clearStats(userId: string = 'default') {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}_${userId}`);
    } catch {
      // fallback
    }
  }
}
