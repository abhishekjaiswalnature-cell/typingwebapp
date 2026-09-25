import React, { useState } from 'react';
import { X, Search, BookOpen, Sparkles, Play, Layers } from 'lucide-react';
import { Lesson } from '../types/typing';
import { WeakKeyService } from '../services/weakKeyService';

interface HindiCharMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCustomLesson: (lesson: Lesson) => void;
}

interface CharGroup {
  title: string;
  subtitle: string;
  items: {
    char: string;
    qwertyKey: string;
    isShift: boolean;
    name: string;
  }[];
}

const HINDI_GROUPS: CharGroup[] = [
  {
    title: 'क-वर्ग (Velar Consonants)',
    subtitle: 'Throat sounds: क, ख, ग, घ, ङ',
    items: [
      { char: 'क', qwertyKey: 'K', isShift: false, name: 'ka' },
      { char: 'ख', qwertyKey: 'Shift + K', isShift: true, name: 'kha' },
      { char: 'ग', qwertyKey: 'I', isShift: false, name: 'ga' },
      { char: 'घ', qwertyKey: 'Shift + I', isShift: true, name: 'gha' },
      { char: 'ङ', qwertyKey: 'Shift + U', isShift: true, name: 'nga' },
    ],
  },
  {
    title: 'च-वर्ग (Palatal Consonants)',
    subtitle: 'Palate sounds: च, छ, ज, झ, ञ',
    items: [
      { char: 'च', qwertyKey: ';', isShift: false, name: 'cha' },
      { char: 'छ', qwertyKey: 'Shift + ; (:)', isShift: true, name: 'chha' },
      { char: 'ज', qwertyKey: 'P', isShift: false, name: 'ja' },
      { char: 'झ', qwertyKey: 'Shift + P', isShift: true, name: 'jha' },
      { char: 'ञ', qwertyKey: 'Shift + ] (})', isShift: true, name: 'nya' },
    ],
  },
  {
    title: 'ट-वर्ग (Retroflex Consonants)',
    subtitle: 'Curled tongue sounds: ट, ठ, ड, ढ, ण',
    items: [
      { char: 'ट', qwertyKey: "'", isShift: false, name: 'ta' },
      { char: 'ठ', qwertyKey: 'Shift + \' (")', isShift: true, name: 'tha' },
      { char: 'ड', qwertyKey: '[', isShift: false, name: 'da' },
      { char: 'ढ', qwertyKey: 'Shift + [ ({)', isShift: true, name: 'dha' },
      { char: 'ण', qwertyKey: 'Shift + C', isShift: true, name: 'nna' },
    ],
  },
  {
    title: 'त-वर्ग (Dental Consonants)',
    subtitle: 'Teeth sounds: त, थ, द, ध, न',
    items: [
      { char: 'त', qwertyKey: 'L', isShift: false, name: 'ta' },
      { char: 'थ', qwertyKey: 'Shift + L', isShift: true, name: 'tha' },
      { char: 'द', qwertyKey: 'O', isShift: false, name: 'da' },
      { char: 'ध', qwertyKey: 'Shift + O', isShift: true, name: 'dha' },
      { char: 'न', qwertyKey: 'V', isShift: false, name: 'na' },
    ],
  },
  {
    title: 'प-वर्ग (Labial Consonants)',
    subtitle: 'Lip sounds: प, फ, ब, भ, म',
    items: [
      { char: 'प', qwertyKey: 'H', isShift: false, name: 'pa' },
      { char: 'फ', qwertyKey: 'Shift + H', isShift: true, name: 'pha' },
      { char: 'ब', qwertyKey: 'Y', isShift: false, name: 'ba' },
      { char: 'भ', qwertyKey: 'Shift + Y', isShift: true, name: 'bha' },
      { char: 'म', qwertyKey: 'C', isShift: false, name: 'ma' },
    ],
  },
  {
    title: 'अन्तःस्थ एवं ऊष्म (Liquids & Sibilants)',
    subtitle: 'Semi-vowels & sibilants: य, र, ल, व, श, ष, स, ह',
    items: [
      { char: 'य', qwertyKey: '/', isShift: false, name: 'ya' },
      { char: 'र', qwertyKey: 'J', isShift: false, name: 'ra' },
      { char: 'ल', qwertyKey: 'N', isShift: false, name: 'la' },
      { char: 'व', qwertyKey: 'B', isShift: false, name: 'va' },
      { char: 'श', qwertyKey: 'Shift + M', isShift: true, name: 'sha' },
      { char: 'ष', qwertyKey: 'Shift + , (<)', isShift: true, name: 'shha' },
      { char: 'स', qwertyKey: 'M', isShift: false, name: 'sa' },
      { char: 'ह', qwertyKey: 'U', isShift: false, name: 'ha' },
    ],
  },
  {
    title: 'स्वर (Full Vowels)',
    subtitle: 'Independent vowels: अ, आ, इ, ई, उ, ऊ, ऋ, ए, ऐ, ओ, औ',
    items: [
      { char: 'अ', qwertyKey: 'Shift + D', isShift: true, name: 'a' },
      { char: 'आ', qwertyKey: 'Shift + E', isShift: true, name: 'aa' },
      { char: 'इ', qwertyKey: 'Shift + F', isShift: true, name: 'i' },
      { char: 'ई', qwertyKey: 'Shift + R', isShift: true, name: 'ee' },
      { char: 'उ', qwertyKey: 'Shift + G', isShift: true, name: 'u' },
      { char: 'ऊ', qwertyKey: 'Shift + T', isShift: true, name: 'oo' },
      { char: 'ऋ', qwertyKey: 'Shift + =', isShift: true, name: 'ri' },
      { char: 'ए', qwertyKey: 'Shift + S', isShift: true, name: 'e' },
      { char: 'ऐ', qwertyKey: 'Shift + W', isShift: true, name: 'ai' },
      { char: 'ओ', qwertyKey: 'Shift + A', isShift: true, name: 'o' },
      { char: 'औ', qwertyKey: 'Shift + Q', isShift: true, name: 'au' },
    ],
  },
  {
    title: 'मात्राएँ एवं हलंत (Matras & Halant)',
    subtitle: 'Vowel signs & virama: ा, ि, ी, ु, ू, ृ, े, ै, ो, ौ, ्',
    items: [
      { char: 'ा', qwertyKey: 'E', isShift: false, name: 'aa matra' },
      { char: 'ि', qwertyKey: 'F', isShift: false, name: 'i matra' },
      { char: 'ी', qwertyKey: 'R', isShift: false, name: 'ee matra' },
      { char: 'ु', qwertyKey: 'G', isShift: false, name: 'u matra' },
      { char: 'ू', qwertyKey: 'T', isShift: false, name: 'oo matra' },
      { char: 'ृ', qwertyKey: '=', isShift: false, name: 'ri matra' },
      { char: 'े', qwertyKey: 'S', isShift: false, name: 'e matra' },
      { char: 'ै', qwertyKey: 'W', isShift: false, name: 'ai matra' },
      { char: 'ो', qwertyKey: 'A', isShift: false, name: 'o matra' },
      { char: 'ौ', qwertyKey: 'Q', isShift: false, name: 'au matra' },
      { char: '्', qwertyKey: 'D', isShift: false, name: 'Halant (virama)' },
      { char: 'ं', qwertyKey: 'X', isShift: false, name: 'Anusvara' },
      { char: 'ँ', qwertyKey: 'Shift + X', isShift: true, name: 'Chandrabindu' },
      { char: 'ः', qwertyKey: 'Shift + -', isShift: true, name: 'Visarga' },
    ],
  },
  {
    title: 'संयुक्ताक्षर (Special Conjuncts)',
    subtitle: 'Direct top-row conjunct keys: क्ष, त्र, ज्ञ, श्र',
    items: [
      { char: 'क्ष', qwertyKey: 'Shift + 7', isShift: true, name: 'ksha (k + d + Shift+,)' },
      { char: 'त्र', qwertyKey: 'Shift + 6', isShift: true, name: 'tra (l + d + j)' },
      { char: 'ज्ञ', qwertyKey: 'Shift + 5', isShift: true, name: 'gya (p + d + Shift+])' },
      { char: 'श्र', qwertyKey: 'Shift + 8', isShift: true, name: 'shra (Shift+M + d + j)' },
    ],
  },
];

export const HindiCharMapModal: React.FC<HindiCharMapModalProps> = ({
  isOpen,
  onClose,
  onStartCustomLesson,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredGroups = HINDI_GROUPS.map((group) => {
    if (!search.trim()) return group;
    const q = search.toLowerCase();
    const filteredItems = group.items.filter(
      (it) =>
        it.char.includes(q) ||
        it.name.toLowerCase().includes(q) ||
        it.qwertyKey.toLowerCase().includes(q)
    );
    return { ...group, items: filteredItems };
  }).filter((group) => group.items.length > 0);

  const handlePracticeGroup = (group: CharGroup) => {
    const chars = group.items.map((i) => i.char);
    const drill = WeakKeyService.generate1to4ProgressiveDrill(chars, 'hi');
    drill.title = `1-to-4 Drill: ${group.title.split(' ')[0]}`;
    drill.description = `Focused 1-to-4 progressive alphabet drill for ${group.title}.`;
    onStartCustomLesson(drill);
    onClose();
  };

  const handlePracticeChar = (char: string) => {
    const drill = WeakKeyService.generate1to4ProgressiveDrill([char], 'hi');
    drill.title = `1-to-4 Drill: Isolated "${char}"`;
    drill.description = `Targeted drill isolating "${char}" with rhythmic 1->2->3->4 repetitions.`;
    onStartCustomLesson(drill);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-xl shadow-xs">
              क
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                हिन्दी InScript Keyboard Map & Quick Drill Launch
              </h2>
              <p className="text-xs text-slate-500">
                Official Indian Standard (IS 1408) layout reference. Click any key or group to practice!
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

        {/* Search */}
        <div className="py-3 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Devanagari character, Latin sound (e.g. 'kha'), or QWERTY key..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Scrollable Groups */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 py-2">
          {filteredGroups.map((group, gIdx) => (
            <div
              key={gIdx}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{group.title}</h3>
                  <p className="text-xs text-slate-500">{group.subtitle}</p>
                </div>
                <button
                  onClick={() => handlePracticeGroup(group)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
                  title="Practice this entire group in 1-to-4 progressive drill"
                >
                  <Play className="w-3 h-3 fill-amber-900" />
                  <span>Practice Group (1-to-4)</span>
                </button>
              </div>

              {/* Characters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
                {group.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePracticeChar(item.char)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs flex flex-col items-center text-center transition-all cursor-pointer group"
                  >
                    <span className="text-2xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                      {item.char}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 border border-emerald-100">
                      {item.qwertyKey}
                    </span>
                    <span className="text-[9px] text-slate-400 mt-0.5">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
