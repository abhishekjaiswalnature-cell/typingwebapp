import { UserProfile } from '../types/typing';

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Software Engineer practicing touch typing for TypeScript and clean rhythm.',
    createdAt: 1718000000000,
    stats: {
      totalCompletedLessons: 18,
      bestWpm: 78,
      averageAccuracy: 97,
      completedLessonIds: ['lesson-1-1', 'lesson-1-2', 'lesson-1-3', 'lesson-1-4', 'lesson-1-5', 'lesson-2-1', 'lesson-6-1', 'lesson-7-1'],
      streakDays: 14,
    },
  },
  {
    id: 'user-marcus',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Speed typist pushing for 100+ WPM with steady cadence.',
    createdAt: 1719000000000,
    stats: {
      totalCompletedLessons: 24,
      bestWpm: 104,
      averageAccuracy: 98,
      completedLessonIds: ['lesson-1-1', 'lesson-1-2', 'lesson-6-1', 'lesson-6-2', 'lesson-6-3'],
      streakDays: 28,
    },
  },
  {
    id: 'user-sarah',
    name: 'Sarah Miller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Beginner student building muscle memory on home row posture.',
    createdAt: 1720000000000,
    stats: {
      totalCompletedLessons: 6,
      bestWpm: 42,
      averageAccuracy: 94,
      completedLessonIds: ['lesson-1-1', 'lesson-1-2', 'lesson-1-3'],
      streakDays: 5,
    },
  },
];
