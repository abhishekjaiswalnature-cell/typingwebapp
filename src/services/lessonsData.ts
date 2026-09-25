import { Lesson } from '../types/typing';
import { HINDI_LESSONS } from './hindiLessons';

export { HINDI_LESSONS };

export const LESSONS: Lesson[] = [
  // ==========================================
  // STAGE 1: HOME ROW ANCHORS & NEIGHBORS (Beginner)
  // ==========================================
  {
    id: 'lesson-1-1',
    stage: 1,
    title: 'Tactile Anchors: F & J',
    category: 'Home Row',
    description: 'Feel the molded bumps on F (left index) and J (right index). Keep all other fingers gently resting.',
    targetKeys: ['f', 'j', ' '],
    primaryFinger: 'leftIndex',
    content: 'f j f j ff jj fff jjj fj jf fjf jfj ff jj f j f j ff jj fj jf ff jj fj jf',
    difficulty: 'beginner',
    language: 'en',
  },
  {
    id: 'lesson-1-2',
    stage: 1,
    title: 'Middle Fingers: D & K',
    category: 'Home Row',
    description: 'Curl middle fingers into D (left middle) and K (right middle) without lifting your index anchors.',
    targetKeys: ['d', 'k', 'f', 'j', ' '],
    primaryFinger: 'leftMiddle',
    content: 'd k d k dd kk dk kd f d j k df jk kf jd dk kd d f k j dk fk jd dd kk dk kd',
    difficulty: 'beginner',
    language: 'en',
  },
  {
    id: 'lesson-1-3',
    stage: 1,
    title: 'Ring Finger Independence: S & L',
    category: 'Home Row',
    description: 'Cultivate ring finger control on S (left ring) and L (right ring).',
    targetKeys: ['s', 'l', 'd', 'k', 'f', 'j', ' '],
    primaryFinger: 'leftRing',
    content: 's l s l ss ll sl ls as dk ls fj sl dk fj ls ss ll sl ls sl fl sk ld ss ll',
    difficulty: 'beginner',
    language: 'en',
  },
  {
    id: 'lesson-1-4',
    stage: 1,
    title: 'Pinky Outposts: A & Semicolon',
    category: 'Home Row',
    description: 'Complete the home row perimeter using left pinky on A and right pinky on semicolon (;).',
    targetKeys: ['a', ';', 's', 'l', 'd', 'k', 'f', 'j', ' '],
    primaryFinger: 'leftPinky',
    content: 'a ; a ; aa ;; a; ;a as df j; lk all fall salad flash flask ask dad lad all ask',
    difficulty: 'beginner',
    language: 'en',
  },
  {
    id: 'lesson-1-5',
    stage: 1,
    title: 'Home Row Lateral Reach: G & H',
    category: 'Home Row',
    description: 'Stretch your index fingers inward: left index hits G, right index hits H, returning immediately to F & J.',
    targetKeys: ['g', 'h', 'f', 'j', 'd', 'k', 's', 'l', 'a', ';', ' '],
    primaryFinger: 'leftIndex',
    content: 'f g f j h j fg jh gh hg glad flash half flag dash slash glass shall gala gas hag hall',
    difficulty: 'beginner',
    language: 'en',
  },
  {
    id: 'lesson-1-6',
    stage: 1,
    title: 'Home Row Word Flow',
    category: 'Home Row',
    description: 'Real English words formed entirely from the 8 home row keys and space.',
    targetKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', ' '],
    content: 'a sad lass had a flask as all lads ask dad; fall salads add glad salsa as glass falls',
    difficulty: 'beginner',
    language: 'en',
  },

  // ==========================================
  // STAGE 2: TOP ROW EXPANSION (Beginner to Intermediate)
  // ==========================================
  {
    id: 'lesson-2-1',
    stage: 2,
    title: 'High-Frequency Vowels: E & I',
    category: 'Top Row',
    description: 'Reach upward diagonally: left middle strikes E, right middle strikes I.',
    targetKeys: ['e', 'i', 'd', 'k', ' '],
    primaryFinger: 'leftMiddle',
    content: 'e i e i ee ii de ki ed ik feed kid field like safe side life self skies alike decide',
    difficulty: 'beginner',
    language: 'en',
  },
  {
    id: 'lesson-2-2',
    stage: 2,
    title: 'Index Upward Reach: R & U',
    category: 'Top Row',
    description: 'Extend index fingers upward to R (left index) and U (right index).',
    targetKeys: ['r', 'u', 'f', 'j', ' '],
    primaryFinger: 'leftIndex',
    content: 'r u r u rr uu fr ju rf uj rural user fluid radar fur sure rules future true ruler',
    difficulty: 'intermediate',
    language: 'en',
  },
  {
    id: 'lesson-2-3',
    stage: 2,
    title: 'Ring & Pinky Top Reach: W, O, P, Q',
    category: 'Top Row',
    description: 'Reach upward with left ring (W), right ring (O), right pinky (P), and left pinky (Q).',
    targetKeys: ['w', 'o', 'p', 'q'],
    primaryFinger: 'leftRing',
    content: 'wo op qu pow slow power equip people quick loop flow quote wipe pool wasp drop grow',
    difficulty: 'intermediate',
    language: 'en',
  },
  {
    id: 'lesson-2-4',
    stage: 2,
    title: 'Top Row Vocabulary Synthesis',
    category: 'Top Row',
    description: 'Integrate the full top and home rows to type fluent English prose.',
    targetKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    content: 'quiet writers require quick power to portray witty thoughts with poise and clarity',
    difficulty: 'intermediate',
    language: 'en',
  },

  // ==========================================
  // STAGE 3: BOTTOM ROW RECOVERY (Intermediate)
  // ==========================================
  {
    id: 'lesson-3-1',
    stage: 3,
    title: 'Downward Core: C & Comma',
    category: 'Bottom Row',
    description: 'Curl middle fingers downward: left middle hits C, right middle hits comma (,).',
    targetKeys: ['c', ',', 'd', 'k', ' '],
    primaryFinger: 'leftMiddle',
    content: 'c , c , cc ,, dc k, cd ,k classic, clear, clock, circle, clinic, focus, calcite, scale,',
    difficulty: 'intermediate',
    language: 'en',
  },
  {
    id: 'lesson-3-2',
    stage: 3,
    title: 'Index Quadrant: V, B, N, M',
    category: 'Bottom Row',
    description: 'Curl index fingers downward to conquer the dynamic bottom-center quadrant.',
    targetKeys: ['v', 'b', 'n', 'm', 'f', 'j', ' '],
    primaryFinger: 'leftIndex',
    content: 'v b n m fv jn fb jm brave visual beacon nomad modern venue dynamic banner vivid member',
    difficulty: 'intermediate',
    language: 'en',
  },
  {
    id: 'lesson-3-3',
    stage: 3,
    title: 'Perimeter Keys: Z, X, Period, Slash',
    category: 'Bottom Row',
    description: 'Carefully reach the outer extremities: left pinky (Z), left ring (X), right ring (.), right pinky (/).',
    targetKeys: ['z', 'x', '.', '/'],
    primaryFinger: 'leftPinky',
    content: 'zeal extra toxic zone zero exist mix. pixel. syntax/zenith flux complex. wax/apex fix.',
    difficulty: 'advanced',
    language: 'en',
  },

  // ==========================================
  // STAGE 4: SHIFT KEYS & CAPITALIZATION (Intermediate)
  // ==========================================
  {
    id: 'lesson-4-1',
    stage: 4,
    title: 'Opposite-Hand Shift Mechanics',
    category: 'Capitalization',
    description: 'When typing a right-hand capital, hold Left Shift with left pinky. When typing a left-hand capital, hold Right Shift.',
    targetKeys: ['ShiftLeft', 'ShiftRight'],
    primaryFinger: 'leftPinky',
    content: 'London Paris Tokyo Rome Berlin Sydney Toronto Chicago Madrid Vienna Dublin Oslo Cairo Seoul',
    difficulty: 'intermediate',
    language: 'en',
  },
  {
    id: 'lesson-4-2',
    stage: 4,
    title: 'Proper Nouns & Sentence Case',
    category: 'Capitalization',
    description: 'Seamlessly shift between capitals and lowercase in natural prose.',
    targetKeys: ['ShiftLeft', 'ShiftRight'],
    content: 'Alice and Bob traveled across North America in July, visiting the Grand Canyon and Seattle.',
    difficulty: 'intermediate',
    language: 'en',
  },

  // ==========================================
  // STAGE 5: NUMBERS & SYMBOLS (Advanced)
  // ==========================================
  {
    id: 'lesson-5-1',
    stage: 5,
    title: 'The Number Row: 1 Through 0',
    category: 'Numbers & Symbols',
    description: 'Direct upward reach from home row to the top numeric digits without looking down.',
    targetKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    content: '1 2 3 4 5 6 7 8 9 0 2026 model 104 keys 365 days 7 days a week room 408 on floor 12',
    difficulty: 'advanced',
    language: 'en',
  },
  {
    id: 'lesson-5-2',
    stage: 5,
    title: 'Punctuation & Common Symbols',
    category: 'Numbers & Symbols',
    description: 'Apostrophes, quotation marks, hyphens, colons, and question marks.',
    targetKeys: ['"', "'", '-', ':', '?', '!'],
    content: 'Did you hear what she said? "The quick-thinking engineer arrived at 8:30 sharp!" Don\'t hesitate.',
    difficulty: 'advanced',
    language: 'en',
  },

  // ==========================================
  // STAGE 6: FULL PARAGRAPH STORIES & ESSAYS (Paragraph Based)
  // ==========================================
  {
    id: 'para-1',
    stage: 6,
    title: 'The Art of Deliberate Practice',
    category: 'Paragraphs',
    description: 'Continuous narrative paragraph focusing on smooth breathing and consistent typing tempo.',
    targetKeys: ['all'],
    content: 'Deliberate practice is not merely repeating a task you already know how to perform; it requires focused attention on your exact weaknesses, immediate feedback on slips, and the quiet patience to refine finger motion until precision becomes effortless second nature.',
    difficulty: 'intermediate',
    isParagraph: true,
    language: 'en',
  },
  {
    id: 'para-2',
    stage: 6,
    title: 'Morning in the Forest by Thoreau',
    category: 'Paragraphs',
    description: 'A rich classic literary excerpt from Walden with natural punctuation and descriptive vocabulary.',
    targetKeys: ['all'],
    content: 'Every morning was a cheerful invitation to make my life of equal simplicity, and I may say innocence, with Nature herself. I got up early and bathed in the pond; that was a religious exercise, and one of the best things which I did.',
    difficulty: 'advanced',
    isParagraph: true,
    language: 'en',
  },
  {
    id: 'para-3',
    stage: 6,
    title: 'The Evolution of Computing & Typography',
    category: 'Paragraphs',
    description: 'A technical prose paragraph exploring mechanical keyboards, mechanical levers, and tactile switches.',
    targetKeys: ['all'],
    content: 'From the cast-iron mechanical levers of early typewriters to the precision tactile leaf springs of modern mechanical keyboards, typing has remained the primary bridge between human thought and digital execution. Developing finger independence unlocks rapid intellectual expression without cognitive friction.',
    difficulty: 'advanced',
    isParagraph: true,
    language: 'en',
  },
  {
    id: 'para-4',
    stage: 6,
    title: 'The Deep Starlit Night (Stamina)',
    category: 'Paragraphs',
    description: 'Longer sustained narrative to test typing endurance, rhythm consistency, and minimal fatigue.',
    targetKeys: ['all'],
    content: 'When the bright sun sinks beyond the distant ridge and twilight blankets the valley, countless stars emerge across the dark celestial dome. Quiet winds whisper through the ancient pine branches, reminding us that perseverance in learning is like the patient voyage of starlight across cosmic distances.',
    difficulty: 'master',
    isParagraph: true,
    language: 'en',
  },

  // ==========================================
  // STAGES 7-10: STRUCTURED HINDI DEVANAGARI TYPING (व्यंजन, स्वर, मात्राएं, वाक्य एवं अनुच्छेद)
  // Sourced from src/services/hindiLessons.ts
  // ==========================================
  ...HINDI_LESSONS,

  // ==========================================
  // STAGE 11: PROGRAMMER SYNTAX & CODE MECHANICS
  // ==========================================
  {
    id: 'code-1',
    stage: 11,
    title: 'JavaScript & TypeScript Modern Syntax',
    category: 'Code Mechanics',
    description: 'Const declarations, arrow functions, template literals, and array chain methods.',
    targetKeys: ['{', '}', '(', ')', '=', '>', ';', ':', '[', ']'],
    content: 'const items = list.filter((item) => item.score >= 90).map((x) => x.id);',
    difficulty: 'advanced',
    language: 'en',
  },
  {
    id: 'code-2',
    stage: 11,
    title: 'Python Comprehensions & Logic',
    category: 'Code Mechanics',
    description: 'Colons, snake_case identifiers, list comprehensions, and boolean expressions.',
    targetKeys: [':', '_', '(', ')', '[', ']', '=', '<', '>'],
    content: 'filtered_records = [rec for rec in data_stream if rec.is_valid and rec.count > 0]',
    difficulty: 'advanced',
    language: 'en',
  },
];
