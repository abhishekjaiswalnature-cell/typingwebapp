import React, { useState, useMemo } from 'react';
import { LESSONS } from '../services/lessonsData';
import { HINDI_LESSONS } from '../services/hindiLessons';
import { Lesson, LessonDifficulty } from '../types/typing';
import { WeakKeyService } from '../services/weakKeyService';
import {
  X,
  CheckCircle,
  ChevronRight,
  Edit3,
  Search,
  BookOpen,
  Globe,
  Sparkles,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Code,
  Layers,
  Target,
} from 'lucide-react';

interface LessonSelectorModalProps {
  isOpen: boolean;
  activeLessonId: string;
  onSelectLesson: (lesson: Lesson) => void;
  onSelectCustomText: (text: string, title: string) => void;
  onClose: () => void;
}

type MainCategory = 'all' | 'hindi' | 'paragraphs' | 'english-drills' | 'code';

type CategoryFilter =
  | 'all'
  // Hindi specific
  | 'hindi'
  | 'hindi-drills'
  | 'hindi-matras'
  | 'hindi-words'
  | 'hindi-paragraphs'
  // Paragraph specific
  | 'paragraph'
  | 'para-hindi'
  | 'para-english'
  // English rows
  | 'drills-all'
  | 'home'
  | 'top'
  | 'bottom'
  | 'shift'
  | 'numbers'
  // Code
  | 'code';

export const LessonSelectorModal: React.FC<LessonSelectorModalProps> = ({
  isOpen,
  activeLessonId,
  onSelectLesson,
  onSelectCustomText,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'custom' | 'weak-drill'>('curriculum');
  const [drillKeysInput, setDrillKeysInput] = useState('क, र, म, न');
  const [drillLang, setDrillLang] = useState<'en' | 'hi'>('hi');
  const [mainCategory, setMainCategory] = useState<MainCategory>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<LessonDifficulty | 'all'>('all');
  const [customText, setCustomText] = useState('');
  const [customTitle, setCustomTitle] = useState('Custom Exercise');

  // Dynamic counts for each category
  const counts = useMemo(() => {
    return {
      all: LESSONS.length,
      hindi: HINDI_LESSONS.length,
      hindiDrills: HINDI_LESSONS.filter((l) => l.stage === 7).length,
      hindiMatras: HINDI_LESSONS.filter((l) => l.stage === 8).length,
      hindiWords: HINDI_LESSONS.filter((l) => l.stage === 9).length,
      hindiParagraphs: HINDI_LESSONS.filter((l) => l.stage === 10 || l.isParagraph).length,
      paragraphs: LESSONS.filter((l) => l.isParagraph || l.stage === 6 || l.stage === 10).length,
      paraEnglish: LESSONS.filter((l) => l.language !== 'hi' && (l.isParagraph || l.stage === 6)).length,
      paraHindi: LESSONS.filter((l) => l.language === 'hi' && (l.isParagraph || l.stage === 10)).length,
      englishDrills: LESSONS.filter((l) => l.language !== 'hi' && l.stage <= 5).length,
      home: LESSONS.filter((l) => l.stage === 1).length,
      top: LESSONS.filter((l) => l.stage === 2).length,
      bottom: LESSONS.filter((l) => l.stage === 3).length,
      shift: LESSONS.filter((l) => l.stage === 4).length,
      numbers: LESSONS.filter((l) => l.stage === 5).length,
      code: LESSONS.filter((l) => l.stage === 11).length,
    };
  }, []);

  // Filter lessons by search query, category pill, and difficulty
  const filteredLessons = useMemo(() => {
    return LESSONS.filter((lesson) => {
      // Main category filter
      if (mainCategory === 'hindi' && lesson.language !== 'hi') return false;
      if (mainCategory === 'paragraphs' && !lesson.isParagraph && lesson.stage !== 6 && lesson.stage !== 10) return false;
      if (mainCategory === 'english-drills' && (lesson.language === 'hi' || lesson.stage > 5)) return false;
      if (mainCategory === 'code' && lesson.stage !== 11) return false;

      // Sub-category pill matching
      if (categoryFilter === 'hindi' && lesson.language !== 'hi') return false;
      if (categoryFilter === 'hindi-drills' && (lesson.language !== 'hi' || lesson.stage !== 7)) return false;
      if (categoryFilter === 'hindi-matras' && (lesson.language !== 'hi' || lesson.stage !== 8)) return false;
      if (categoryFilter === 'hindi-words' && (lesson.language !== 'hi' || lesson.stage !== 9)) return false;
      if (categoryFilter === 'hindi-paragraphs' && (lesson.language !== 'hi' || (lesson.stage !== 10 && !lesson.isParagraph))) return false;

      if (categoryFilter === 'paragraph' && !lesson.isParagraph && lesson.stage !== 6 && lesson.stage !== 10) return false;
      if (categoryFilter === 'para-english' && (lesson.language === 'hi' || (!lesson.isParagraph && lesson.stage !== 6))) return false;
      if (categoryFilter === 'para-hindi' && (lesson.language !== 'hi' || (!lesson.isParagraph && lesson.stage !== 10))) return false;

      if (categoryFilter === 'drills-all' && (lesson.language === 'hi' || lesson.stage > 5)) return false;
      if (categoryFilter === 'home' && lesson.stage !== 1) return false;
      if (categoryFilter === 'top' && lesson.stage !== 2) return false;
      if (categoryFilter === 'bottom' && lesson.stage !== 3) return false;
      if (categoryFilter === 'shift' && lesson.stage !== 4) return false;
      if (categoryFilter === 'numbers' && lesson.stage !== 5) return false;
      if (categoryFilter === 'code' && lesson.stage !== 11) return false;

      // Difficulty matching
      if (selectedDifficulty !== 'all' && lesson.difficulty !== selectedDifficulty) return false;

      // Search query matching
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = lesson.title.toLowerCase().includes(q);
        const matchesCategory = lesson.category.toLowerCase().includes(q);
        const matchesDesc = lesson.description.toLowerCase().includes(q);
        const matchesContent = lesson.content.toLowerCase().includes(q);
        const matchesKeys = lesson.targetKeys.some((k) => k.toLowerCase().includes(q));
        const matchesHindiTag = (q === 'hindi' || q === 'हिन्दी') && lesson.language === 'hi';
        const matchesParaTag = q === 'paragraph' && (lesson.isParagraph || lesson.stage === 6 || lesson.stage === 10);
        if (!matchesTitle && !matchesCategory && !matchesDesc && !matchesContent && !matchesKeys && !matchesHindiTag && !matchesParaTag) {
          return false;
        }
      }

      return true;
    });
  }, [mainCategory, categoryFilter, selectedDifficulty, searchQuery]);

  if (!isOpen) return null;

  const stages = [
    { num: 1, title: 'Home Row Foundations', icon: '🏠' },
    { num: 2, title: 'Top Row Expansion', icon: '⬆️' },
    { num: 3, title: 'Bottom Row Recovery', icon: '⬇️' },
    { num: 4, title: 'Shift & Capitalization', icon: '🔠' },
    { num: 5, title: 'Numbers & Common Symbols', icon: '🔢' },
    { num: 6, title: 'Paragraph-Based Stories & Longform', icon: '📖' },
    { num: 7, title: '1 से 4 अक्षर क्रमिक अभ्यास (1-to-4 Progressive Drills)', icon: '🇮🇳' },
    { num: 8, title: 'हिन्दी मात्राएं एवं हलन्त (Hindi Matras & Half-Letters)', icon: '✨' },
    { num: 9, title: 'हिन्दी शब्द एवं सुविचार (Hindi Words & Quotes)', icon: '💬' },
    { num: 10, title: 'हिन्दी विस्तृत अनुच्छेद (Hindi Full Paragraphs & Stories)', icon: '📜' },
    { num: 11, title: 'Programmer Syntax & Code Mechanics', icon: '💻' },
  ];

  const handleStartCustom = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    onSelectCustomText(trimmed, customTitle || 'Custom Exercise');
  };

  const handleResetFilters = () => {
    setMainCategory('all');
    setCategoryFilter('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    mainCategory !== 'all' ||
    categoryFilter !== 'all' ||
    selectedDifficulty !== 'all' ||
    searchQuery.trim() !== '';

  const difficultyColors: Record<LessonDifficulty, string> = {
    beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    intermediate: 'bg-sky-50 text-sky-700 border-sky-200',
    advanced: 'bg-purple-50 text-purple-700 border-purple-200',
    master: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const quickSearchChips = [
    { label: '🔤 1-to-4 Drills', query: '1 अक्षर' },
    { label: '🇮🇳 हिन्दी', query: 'हिन्दी' },
    { label: '📖 Paragraphs', query: 'Paragraph' },
    { label: '🏠 Home Row', query: 'Home Row' },
    { label: '✨ मात्राएं', query: 'मात्राएं' },
    { label: '🚀 अंतरिक्ष / ISRO', query: 'अंतरिक्ष' },
    { label: '📜 Stories', query: 'कथा' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-selector-title"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-6 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-600">Curriculum & Exercises</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                {counts.all} Total Exercises
              </span>
            </div>
            <h2 id="lesson-selector-title" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Select Typing Lesson
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close lesson selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Curriculum vs Custom */}
        <div className="flex items-center gap-1 my-2.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'curriculum'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Curriculum Catalog</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Custom Text / Paste</span>
          </button>
          <button
            onClick={() => setActiveTab('weak-drill')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'weak-drill'
                ? 'bg-white text-purple-900 shadow-sm border border-purple-200'
                : 'text-slate-500 hover:text-purple-700'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-purple-600" />
            <span>Smart 1-to-4 Drill Generator</span>
          </button>
        </div>

        {/* Search Bar & Category Filter Controls (Curriculum mode) */}
        {activeTab === 'curriculum' && (
          <div className="space-y-2.5 mb-3">
            {/* Primary Category Segmented Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => {
                  setMainCategory('all');
                  setCategoryFilter('all');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                  mainCategory === 'all' && categoryFilter === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>🌐 All Lessons</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-white/20 text-current">
                  {counts.all}
                </span>
              </button>

              <button
                onClick={() => {
                  setMainCategory('hindi');
                  setCategoryFilter('hindi');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                  mainCategory === 'hindi'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100 hover:text-amber-950'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>🇮🇳 हिन्दी Typing</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  mainCategory === 'hindi' ? 'bg-amber-700 text-white' : 'bg-amber-200/80 text-amber-900'
                }`}>
                  {counts.hindi}
                </span>
              </button>

              <button
                onClick={() => {
                  setMainCategory('paragraphs');
                  setCategoryFilter('paragraph');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                  mainCategory === 'paragraphs'
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-sky-50/80 text-sky-800 border-sky-200 hover:bg-sky-100 hover:text-sky-950'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>📖 Paragraphs</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  mainCategory === 'paragraphs' ? 'bg-sky-700 text-white' : 'bg-sky-200/80 text-sky-900'
                }`}>
                  {counts.paragraphs}
                </span>
              </button>

              <button
                onClick={() => {
                  setMainCategory('english-drills');
                  setCategoryFilter('drills-all');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                  mainCategory === 'english-drills'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-emerald-50/80 text-emerald-800 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-950'
                }`}
              >
                <span>⌨️ English Touch Typing</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  mainCategory === 'english-drills' ? 'bg-emerald-800 text-white' : 'bg-emerald-200/80 text-emerald-900'
                }`}>
                  {counts.englishDrills}
                </span>
              </button>

              <button
                onClick={() => {
                  setMainCategory('code');
                  setCategoryFilter('code');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                  mainCategory === 'code'
                    ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                    : 'bg-purple-50/80 text-purple-800 border-purple-200 hover:bg-purple-100 hover:text-purple-950'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>💻 Code Syntax</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  mainCategory === 'code' ? 'bg-purple-800 text-white' : 'bg-purple-200/80 text-purple-900'
                }`}>
                  {counts.code}
                </span>
              </button>
            </div>

            {/* Contextual Sub-Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                <SlidersHorizontal className="w-3 h-3" />
                Sub-filter:
              </span>

              {/* Hindi sub-filters */}
              {mainCategory === 'hindi' && (
                <>
                  <button
                    onClick={() => setCategoryFilter('hindi')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'hindi'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    All Hindi ({counts.hindi})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('hindi-drills')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'hindi-drills'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🔤 1 से 4 अक्षर Drills ({counts.hindiDrills})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('hindi-matras')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'hindi-matras'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    ✨ मात्राएं व हलन्त ({counts.hindiMatras})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('hindi-words')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'hindi-words'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    💬 शब्द व वाक्य ({counts.hindiWords})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('hindi-paragraphs')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'hindi-paragraphs'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    📜 विस्तृत अनुच्छेद ({counts.hindiParagraphs})
                  </button>
                </>
              )}

              {/* Paragraphs sub-filters */}
              {mainCategory === 'paragraphs' && (
                <>
                  <button
                    onClick={() => setCategoryFilter('paragraph')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'paragraph'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    All Paragraphs ({counts.paragraphs})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('para-hindi')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'para-hindi'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🇮🇳 हिन्दी अनुच्छेद ({counts.paraHindi})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('para-english')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'para-english'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🇬🇧 English Stories ({counts.paraEnglish})
                  </button>
                </>
              )}

              {/* English drills sub-filters */}
              {mainCategory === 'english-drills' && (
                <>
                  <button
                    onClick={() => setCategoryFilter('drills-all')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'drills-all'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    All Drills ({counts.englishDrills})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('home')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'home'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Home Row ({counts.home})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('top')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'top'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Top Row ({counts.top})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('bottom')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'bottom'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Bottom Row ({counts.bottom})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('shift')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'shift'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Capitals ({counts.shift})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('numbers')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'numbers'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Numbers ({counts.numbers})
                  </button>
                </>
              )}

              {/* All curriculum sub-filters */}
              {mainCategory === 'all' && (
                <>
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'all'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    All Stages ({counts.all})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('hindi')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'hindi'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    🇮🇳 हिन्दी ({counts.hindi})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('paragraph')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'paragraph'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    📖 Paragraphs ({counts.paragraphs})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('home')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'home'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Home Row ({counts.home})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('top')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'top'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Top Row ({counts.top})
                  </button>
                  <button
                    onClick={() => setCategoryFilter('code')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer border ${
                      categoryFilter === 'code'
                        ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Code ({counts.code})
                  </button>
                </>
              )}

              {/* Code sub-filter */}
              {mainCategory === 'code' && (
                <span className="text-xs text-purple-700 font-semibold px-2 py-0.5 bg-purple-50 rounded-lg border border-purple-200">
                  JavaScript, TypeScript & Python syntax drills
                </span>
              )}
            </div>

            {/* InScript Hindi guidance callout */}
            {(mainCategory === 'hindi' || categoryFilter.startsWith('hindi')) && (
              <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-center justify-between text-xs text-amber-900 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-base">🇮🇳</span>
                  <div>
                    <span className="font-bold">Devanagari InScript Standard: </span>
                    <span className="text-amber-800">
                      Standard English keyboards map automatically to Hindi consonants & matras. Direct Unicode typing also supported!
                    </span>
                  </div>
                </div>
                <span className="hidden sm:inline text-[11px] font-semibold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-lg shrink-0 border border-amber-300">
                  Auto Layout
                </span>
              </div>
            )}

            {/* Search Bar & Difficulty Selector */}
            <div className="flex flex-col sm:flex-row gap-2 pt-0.5">
              {/* Search input with live match counter */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lessons (e.g. 'परिश्रम', 'InScript', 'Home Row', 'Story', 'Space', 'क ख ग')..."
                  className="w-full pl-9 pr-20 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                />
                <div className="absolute right-2.5 top-1.5 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200/70 text-slate-600">
                    {filteredLessons.length}
                  </span>
                </div>
              </div>

              {/* Difficulty selector */}
              <div className="flex items-center gap-1 overflow-x-auto shrink-0">
                {(['all', 'beginner', 'intermediate', 'advanced', 'master'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1.5 text-[11px] font-bold rounded-lg capitalize transition-colors cursor-pointer border ${
                      selectedDifficulty === diff
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Keyword Search Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider shrink-0 mr-0.5">
                Popular:
              </span>
              {quickSearchChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => {
                    setSearchQuery(chip.query);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
                    searchQuery === chip.query
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {chip.label}
                </button>
              ))}

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="ml-auto px-2 py-0.5 rounded-md text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {activeTab === 'curriculum' ? (
            filteredLessons.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm space-y-2">
                <p className="font-semibold text-slate-600">No lessons matched your search or filters.</p>
                <p className="text-xs">
                  {searchQuery ? `No results found for "${searchQuery}".` : 'Try selecting another category or difficulty.'}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 cursor-pointer inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              stages.map((stage) => {
                const stageLessons = filteredLessons.filter((l) => l.stage === stage.num);
                if (stageLessons.length === 0) return null;

                return (
                  <div key={`stage-${stage.num}`} className="space-y-2.5">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span>{stage.icon}</span>
                        <span>Stage {stage.num} · {stage.title}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {stageLessons.length} {stageLessons.length === 1 ? 'exercise' : 'exercises'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {stageLessons.map((lesson) => {
                        const isActive = lesson.id === activeLessonId;
                        const wordCount = lesson.content.trim().split(/\s+/).length;

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => onSelectLesson(lesson)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative ${
                              isActive
                                ? 'bg-emerald-50/70 border-emerald-400 shadow-sm ring-1 ring-emerald-400/50'
                                : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md hover:translate-y-[-1px]'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                      {lesson.title}
                                    </span>
                                    {lesson.isParagraph && (
                                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-200">
                                        Paragraph · {wordCount} words
                                      </span>
                                    )}
                                    {lesson.language === 'hi' && (
                                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                        हिन्दी InScript
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {isActive ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shrink-0 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Active
                                  </span>
                                ) : (
                                  <span className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shrink-0 flex items-center gap-1 shadow-xs">
                                    <Play className="w-2.5 h-2.5 fill-current" />
                                    Open
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                {lesson.description}
                              </p>

                              {/* Preview snippet */}
                              <div className="pt-1">
                                <p className={`text-[11px] text-slate-400 line-clamp-1 italic ${
                                  lesson.language === 'hi' ? "font-['Noto_Sans_Devanagari',sans-serif]" : "font-mono"
                                }`}>
                                  "{lesson.content.slice(0, 75)}..."
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100/80">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                    difficultyColors[lesson.difficulty]
                                  }`}
                                >
                                  {lesson.difficulty}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {lesson.content.length} characters
                                </span>
                              </div>

                              <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold group-hover:translate-x-1 transition-transform">
                                <span>Start Lesson</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )
          ) : activeTab === 'weak-drill' ? (
            /* Smart 1-to-4 Weak-Key Drill Generator Mode */
            <div className="space-y-5 pt-2 animate-fade-in">
              <div className="rounded-2xl bg-purple-50/60 border border-purple-200 p-4">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-sm mb-1">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>The 1-to-4 Progressive Alphabet Drill Engine</span>
                </div>
                <p className="text-xs text-purple-800/80 leading-relaxed">
                  Enter 1 to 4 keys (or pick from your recorded history). The algorithm constructs a structured drill:
                  <strong> Step 1</strong> isolates key 1 (e.g. क क क कक ककक),
                  <strong> Step 2</strong> pairs keys 1 & 2 (e.g. कर रक करकर),
                  <strong> Step 3</strong> creates 3-key word patterns, and
                  <strong> Step 4</strong> creates a full 4-key cadence.
                </p>
              </div>

              {/* Language Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Target Language
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setDrillLang('hi');
                      setDrillKeysInput('क, र, म, न');
                    }}
                    className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      drillLang === 'hi'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>🇮🇳 हिन्दी Devanagari Drills</span>
                  </button>
                  <button
                    onClick={() => {
                      setDrillLang('en');
                      setDrillKeysInput('f, j, d, k');
                    }}
                    className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      drillLang === 'en'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>🔤 English QWERTY Drills</span>
                  </button>
                </div>
              </div>

              {/* Key Input */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  1 to 4 Keys to Master (Comma or Space Separated)
                </label>
                <input
                  type="text"
                  value={drillKeysInput}
                  onChange={(e) => setDrillKeysInput(e.target.value)}
                  placeholder="e.g. क, र, म, न or f, j, d, k"
                  className="w-full px-4 py-2.5 text-base font-mono rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white"
                />
              </div>

              {/* Quick Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Recommended Drill Combos:
                </span>
                <div className="flex flex-wrap gap-2">
                  {drillLang === 'hi' ? (
                    <>
                      <button
                        onClick={() => setDrillKeysInput('क, र, म, न')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        क र म न (Home Core)
                      </button>
                      <button
                        onClick={() => setDrillKeysInput('त, स, य, प')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        त स य प (Upper/Bottom Reaches)
                      </button>
                      <button
                        onClick={() => setDrillKeysInput('ा, ि, ी, ु')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        ा ि ी ु (Primary Matras)
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setDrillKeysInput('f, j, d, k')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        f j d k (Home Anchors)
                      </button>
                      <button
                        onClick={() => setDrillKeysInput('e, r, i, o')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        e r i o (Vowel Reach)
                      </button>
                      <button
                        onClick={() => setDrillKeysInput('c, v, m, n')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        c v m n (Bottom Row)
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const keys = drillKeysInput
                      .replace(/,/g, ' ')
                      .split(/\s+/)
                      .map((k) => k.trim())
                      .filter((k) => k.length > 0);
                    const lesson = WeakKeyService.generate1to4ProgressiveDrill(keys, drillLang);
                    onSelectLesson(lesson);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 shadow-md shadow-purple-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Build & Start 1-to-4 Drill</span>
                </button>
              </div>
            </div>
          ) : (
            /* Custom text mode */
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Exercise Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. My Custom Practice, Hindi Essay, Code Drill"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Paste Custom Text, Paragraph, Hindi, or Code
                </label>
                <textarea
                  rows={7}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Paste any article, paragraph, Hindi Devanagari text (e.g. भारत हमारा देश है।), literature excerpt, or code snippet here..."
                  className="w-full p-3.5 text-sm font-mono rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                  <span>{customText.length} characters · {customText.trim() ? customText.trim().split(/\s+/).length : 0} words</span>
                  <span>Supports any language & symbols</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartCustom}
                  disabled={!customText.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Custom Exercise</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
