export interface DayActivity {
  date: string; // 'YYYY-MM-DD'
  lessonsCount: number;
  goalMet: boolean;
}

export interface StreakState {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string | null; // 'YYYY-MM-DD'
  todayLessonsCompleted: number;
  dailyGoal: number; // e.g. 3 lessons
  goalReachedToday: boolean;
  lastGoalAchievedDate: string | null;
  history: Record<string, number>; // dateString -> lessonsCompleted
}

const STREAK_STORAGE_PREFIX = 'kinesis_daily_streak_';

export function getTodayDateString(offsetDays: number = 0): string {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  return getTodayDateString(-1);
}

export class StreakService {
  private static getStorageKey(userId?: string): string {
    return `${STREAK_STORAGE_PREFIX}${userId || 'global'}_v1`;
  }

  public static getStreak(userId?: string, initialStreakDays = 1): StreakState {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    const key = this.getStorageKey(userId);

    const defaultState: StreakState = {
      currentStreak: initialStreakDays > 0 ? initialStreakDays : 1,
      bestStreak: Math.max(initialStreakDays, 1),
      lastActiveDate: today,
      todayLessonsCompleted: 0,
      dailyGoal: 3,
      goalReachedToday: false,
      lastGoalAchievedDate: null,
      history: {},
    };

    if (typeof window === 'undefined') return defaultState;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        // Seed initial state
        localStorage.setItem(key, JSON.stringify(defaultState));
        return defaultState;
      }

      const parsed: StreakState = JSON.parse(raw);
      let updated = false;

      // Handle day rollover:
      if (parsed.lastActiveDate === today) {
        // Active today - maintain state
        parsed.goalReachedToday = (parsed.todayLessonsCompleted >= parsed.dailyGoal) || (parsed.lastGoalAchievedDate === today);
      } else if (parsed.lastActiveDate === yesterday) {
        // Practiced yesterday, hasn't practiced yet today -> streak maintained!
        parsed.todayLessonsCompleted = 0;
        parsed.goalReachedToday = false;
        updated = true;
      } else if (parsed.lastActiveDate && parsed.lastActiveDate < yesterday) {
        // Missed one or more days -> streak broken
        parsed.currentStreak = 0;
        parsed.todayLessonsCompleted = 0;
        parsed.goalReachedToday = false;
        updated = true;
      }

      if (updated) {
        localStorage.setItem(key, JSON.stringify(parsed));
      }

      return parsed;
    } catch {
      return defaultState;
    }
  }

  public static recordLessonCompleted(
    userId?: string
  ): {
    state: StreakState;
    justHitGoal: boolean;
    streakIncreased: boolean;
  } {
    const key = this.getStorageKey(userId);
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    const current = this.getStreak(userId);
    let streakIncreased = false;
    let newCurrentStreak = current.currentStreak;

    if (current.lastActiveDate === today) {
      // Already active today, streak count already credited for today
      newCurrentStreak = Math.max(1, current.currentStreak);
    } else if (current.lastActiveDate === yesterday) {
      // Continuation from yesterday!
      newCurrentStreak = current.currentStreak + 1;
      streakIncreased = true;
    } else {
      // First day or restarting after broken streak
      newCurrentStreak = 1;
      streakIncreased = true;
    }

    const nextLessonsCompleted = (current.lastActiveDate === today ? current.todayLessonsCompleted : 0) + 1;
    const newBest = Math.max(current.bestStreak, newCurrentStreak);

    const wasGoalAlreadyMet = current.goalReachedToday && current.lastGoalAchievedDate === today;
    const justHitGoal = !wasGoalAlreadyMet && nextLessonsCompleted >= current.dailyGoal;
    const goalReachedToday = wasGoalAlreadyMet || justHitGoal;

    const newHistory = { ...current.history };
    newHistory[today] = nextLessonsCompleted;

    const nextState: StreakState = {
      ...current,
      currentStreak: newCurrentStreak,
      bestStreak: newBest,
      lastActiveDate: today,
      todayLessonsCompleted: nextLessonsCompleted,
      goalReachedToday,
      lastGoalAchievedDate: goalReachedToday ? (current.lastGoalAchievedDate || today) : null,
      history: newHistory,
    };

    try {
      localStorage.setItem(key, JSON.stringify(nextState));
    } catch {
      // localStorage fallback
    }

    return {
      state: nextState,
      justHitGoal,
      streakIncreased,
    };
  }

  public static setDailyGoal(goal: number, userId?: string): StreakState {
    const key = this.getStorageKey(userId);
    const current = this.getStreak(userId);
    const safeGoal = Math.max(1, Math.min(20, goal));

    const today = getTodayDateString();
    const goalReachedToday = current.todayLessonsCompleted >= safeGoal;

    const nextState: StreakState = {
      ...current,
      dailyGoal: safeGoal,
      goalReachedToday,
      lastGoalAchievedDate: goalReachedToday ? (current.lastGoalAchievedDate || today) : null,
    };

    try {
      localStorage.setItem(key, JSON.stringify(nextState));
    } catch {
      // fallback
    }

    return nextState;
  }

  public static getLast7Days(userId?: string): DayActivity[] {
    const current = this.getStreak(userId);
    const days: DayActivity[] = [];

    for (let i = 6; i >= 0; i--) {
      const dateStr = getTodayDateString(-i);
      const count = current.history[dateStr] || (dateStr === current.lastActiveDate ? current.todayLessonsCompleted : 0);
      days.push({
        date: dateStr,
        lessonsCount: count,
        goalMet: count >= current.dailyGoal,
      });
    }

    return days;
  }
}
