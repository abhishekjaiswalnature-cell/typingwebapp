import { Finger, Hand, KeyDefinition, KeyboardLayoutMode } from '../types/typing';

// Standard QWERTY Layout Rows
export const QWERTY_ROWS: KeyDefinition[][] = [
  // Row 0: Numbers & Symbols
  [
    { code: 'Backquote', label: '`', shiftLabel: '~', finger: 'leftPinky', hand: 'left', row: 0, widthUnit: 1 },
    { code: 'Digit1', label: '1', shiftLabel: '!', finger: 'leftPinky', hand: 'left', row: 0, widthUnit: 1 },
    { code: 'Digit2', label: '2', shiftLabel: '@', finger: 'leftRing', hand: 'left', row: 0, widthUnit: 1 },
    { code: 'Digit3', label: '3', shiftLabel: '#', finger: 'leftMiddle', hand: 'left', row: 0, widthUnit: 1 },
    { code: 'Digit4', label: '4', shiftLabel: '$', finger: 'leftIndex', hand: 'left', row: 0, widthUnit: 1 },
    { code: 'Digit5', label: '5', shiftLabel: '%', finger: 'leftIndex', hand: 'left', row: 0, widthUnit: 1 },
    { code: 'Digit6', label: '6', shiftLabel: '^', finger: 'rightIndex', hand: 'right', row: 0, widthUnit: 1 },
    { code: 'Digit7', label: '7', shiftLabel: '&', finger: 'rightIndex', hand: 'right', row: 0, widthUnit: 1 },
    { code: 'Digit8', label: '8', shiftLabel: '*', finger: 'rightMiddle', hand: 'right', row: 0, widthUnit: 1 },
    { code: 'Digit9', label: '9', shiftLabel: '(', finger: 'rightRing', hand: 'right', row: 0, widthUnit: 1 },
    { code: 'Digit0', label: '0', shiftLabel: ')', finger: 'rightPinky', hand: 'right', row: 0, widthUnit: 1 },
    { code: 'Minus', label: '-', shiftLabel: '_', finger: 'rightPinky', hand: 'right', row: 0, widthUnit: 1 },
    { code: 'Equal', label: '=', shiftLabel: '+', finger: 'rightPinky', hand: 'right', row: 0, widthUnit: 1 },
    { code: 'Backspace', label: 'Backspace', finger: 'rightPinky', hand: 'right', row: 0, widthUnit: 2 },
  ],
  // Row 1: Top Row
  [
    { code: 'Tab', label: 'Tab', finger: 'leftPinky', hand: 'left', row: 1, widthUnit: 1.5 },
    { code: 'KeyQ', label: 'Q', shiftLabel: 'Q', finger: 'leftPinky', hand: 'left', row: 1, widthUnit: 1 },
    { code: 'KeyW', label: 'W', shiftLabel: 'W', finger: 'leftRing', hand: 'left', row: 1, widthUnit: 1 },
    { code: 'KeyE', label: 'E', shiftLabel: 'E', finger: 'leftMiddle', hand: 'left', row: 1, widthUnit: 1 },
    { code: 'KeyR', label: 'R', shiftLabel: 'R', finger: 'leftIndex', hand: 'left', row: 1, widthUnit: 1 },
    { code: 'KeyT', label: 'T', shiftLabel: 'T', finger: 'leftIndex', hand: 'left', row: 1, widthUnit: 1 },
    { code: 'KeyY', label: 'Y', shiftLabel: 'Y', finger: 'rightIndex', hand: 'right', row: 1, widthUnit: 1 },
    { code: 'KeyU', label: 'U', shiftLabel: 'U', finger: 'rightIndex', hand: 'right', row: 1, widthUnit: 1 },
    { code: 'KeyI', label: 'I', shiftLabel: 'I', finger: 'rightMiddle', hand: 'right', row: 1, widthUnit: 1 },
    { code: 'KeyO', label: 'O', shiftLabel: 'O', finger: 'rightRing', hand: 'right', row: 1, widthUnit: 1 },
    { code: 'KeyP', label: 'P', shiftLabel: 'P', finger: 'rightPinky', hand: 'right', row: 1, widthUnit: 1 },
    { code: 'BracketLeft', label: '[', shiftLabel: '{', finger: 'rightPinky', hand: 'right', row: 1, widthUnit: 1 },
    { code: 'BracketRight', label: ']', shiftLabel: '}', finger: 'rightPinky', hand: 'right', row: 1, widthUnit: 1 },
    { code: 'Backslash', label: '\\', shiftLabel: '|', finger: 'rightPinky', hand: 'right', row: 1, widthUnit: 1.5 },
  ],
  // Row 2: Home Row
  [
    { code: 'CapsLock', label: 'Caps', finger: 'leftPinky', hand: 'left', row: 2, widthUnit: 1.75 },
    { code: 'KeyA', label: 'A', shiftLabel: 'A', finger: 'leftPinky', hand: 'left', row: 2, widthUnit: 1, homeKey: true },
    { code: 'KeyS', label: 'S', shiftLabel: 'S', finger: 'leftRing', hand: 'left', row: 2, widthUnit: 1, homeKey: true },
    { code: 'KeyD', label: 'D', shiftLabel: 'D', finger: 'leftMiddle', hand: 'left', row: 2, widthUnit: 1, homeKey: true },
    { code: 'KeyF', label: 'F', shiftLabel: 'F', finger: 'leftIndex', hand: 'left', row: 2, widthUnit: 1, homeKey: true, bump: true },
    { code: 'KeyG', label: 'G', shiftLabel: 'G', finger: 'leftIndex', hand: 'left', row: 2, widthUnit: 1 },
    { code: 'KeyH', label: 'H', shiftLabel: 'H', finger: 'rightIndex', hand: 'right', row: 2, widthUnit: 1 },
    { code: 'KeyJ', label: 'J', shiftLabel: 'J', finger: 'rightIndex', hand: 'right', row: 2, widthUnit: 1, homeKey: true, bump: true },
    { code: 'KeyK', label: 'K', shiftLabel: 'K', finger: 'rightMiddle', hand: 'right', row: 2, widthUnit: 1, homeKey: true },
    { code: 'KeyL', label: 'L', shiftLabel: 'L', finger: 'rightRing', hand: 'right', row: 2, widthUnit: 1, homeKey: true },
    { code: 'Semicolon', label: ';', shiftLabel: ':', finger: 'rightPinky', hand: 'right', row: 2, widthUnit: 1, homeKey: true },
    { code: 'Quote', label: "'", shiftLabel: '"', finger: 'rightPinky', hand: 'right', row: 2, widthUnit: 1 },
    { code: 'Enter', label: 'Enter', finger: 'rightPinky', hand: 'right', row: 2, widthUnit: 2.25 },
  ],
  // Row 3: Bottom Row
  [
    { code: 'ShiftLeft', label: 'Shift', finger: 'leftPinky', hand: 'left', row: 3, widthUnit: 2.25 },
    { code: 'KeyZ', label: 'Z', shiftLabel: 'Z', finger: 'leftPinky', hand: 'left', row: 3, widthUnit: 1 },
    { code: 'KeyX', label: 'X', shiftLabel: 'X', finger: 'leftRing', hand: 'left', row: 3, widthUnit: 1 },
    { code: 'KeyC', label: 'C', shiftLabel: 'C', finger: 'leftMiddle', hand: 'left', row: 3, widthUnit: 1 },
    { code: 'KeyV', label: 'V', shiftLabel: 'V', finger: 'leftIndex', hand: 'left', row: 3, widthUnit: 1 },
    { code: 'KeyB', label: 'B', shiftLabel: 'B', finger: 'leftIndex', hand: 'left', row: 3, widthUnit: 1 },
    { code: 'KeyN', label: 'N', shiftLabel: 'N', finger: 'rightIndex', hand: 'right', row: 3, widthUnit: 1 },
    { code: 'KeyM', label: 'M', shiftLabel: 'M', finger: 'rightIndex', hand: 'right', row: 3, widthUnit: 1 },
    { code: 'Comma', label: ',', shiftLabel: '<', finger: 'rightMiddle', hand: 'right', row: 3, widthUnit: 1 },
    { code: 'Period', label: '.', shiftLabel: '>', finger: 'rightRing', hand: 'right', row: 3, widthUnit: 1 },
    { code: 'Slash', label: '/', shiftLabel: '?', finger: 'rightPinky', hand: 'right', row: 3, widthUnit: 1 },
    { code: 'ShiftRight', label: 'Shift', finger: 'rightPinky', hand: 'right', row: 3, widthUnit: 2.75 },
  ],
  // Row 4: Space Row
  [
    { code: 'ControlLeft', label: 'Ctrl', finger: 'leftPinky', hand: 'left', row: 4, widthUnit: 1.5 },
    { code: 'AltLeft', label: 'Alt', finger: 'leftThumb', hand: 'left', row: 4, widthUnit: 1.5 },
    { code: 'Space', label: 'Space', finger: 'rightThumb', hand: 'right', row: 4, widthUnit: 7.25 },
    { code: 'AltRight', label: 'Alt', finger: 'rightThumb', hand: 'right', row: 4, widthUnit: 1.5 },
    { code: 'ControlRight', label: 'Ctrl', finger: 'rightPinky', hand: 'right', row: 4, widthUnit: 1.5 },
  ],
];

export const KEYBOARD_ROWS = QWERTY_ROWS;

// InScript Devanagari Hindi Layout Standard (Official Indian Standard IS 1408)
export const HINDI_INSCRIPT_MAPPING: Record<string, { normal: string; shift: string }> = {
  Digit1: { normal: '१', shift: 'ऍ' },
  Digit2: { normal: '२', shift: 'ॅ' },
  Digit3: { normal: '३', shift: '्र' },
  Digit4: { normal: '४', shift: 'र्' },
  Digit5: { normal: '५', shift: 'ज्ञ' },
  Digit6: { normal: '६', shift: 'त्र' },
  Digit7: { normal: '७', shift: 'क्ष' },
  Digit8: { normal: '८', shift: 'श्र' },
  Digit9: { normal: '९', shift: '(' },
  Digit0: { normal: '०', shift: ')' },
  Minus: { normal: '-', shift: 'ः' },
  Equal: { normal: 'ृ', shift: 'ऋ' },

  KeyQ: { normal: 'ौ', shift: 'औ' },
  KeyW: { normal: 'ै', shift: 'ऐ' },
  KeyE: { normal: 'ा', shift: 'आ' },
  KeyR: { normal: 'ी', shift: 'ई' },
  KeyT: { normal: 'ू', shift: 'ऊ' },
  KeyY: { normal: 'ब', shift: 'भ' },
  KeyU: { normal: 'ह', shift: 'ङ' },
  KeyI: { normal: 'ग', shift: 'घ' },
  KeyO: { normal: 'द', shift: 'ध' },
  KeyP: { normal: 'ज', shift: 'झ' },
  BracketLeft: { normal: 'ड', shift: 'ढ' },
  BracketRight: { normal: '़', shift: 'ञ' },

  KeyA: { normal: 'ो', shift: 'ओ' },
  KeyS: { normal: 'े', shift: 'ए' },
  KeyD: { normal: '्', shift: 'अ' },
  KeyF: { normal: 'ि', shift: 'इ' },
  KeyG: { normal: 'ु', shift: 'उ' },
  KeyH: { normal: 'प', shift: 'फ' },
  KeyJ: { normal: 'र', shift: 'ऱ' },
  KeyK: { normal: 'क', shift: 'ख' },
  KeyL: { normal: 'त', shift: 'थ' },
  Semicolon: { normal: 'च', shift: 'छ' },
  Quote: { normal: 'ट', shift: 'ठ' },

  KeyZ: { normal: 'ॆ', shift: 'ऎ' },
  KeyX: { normal: 'ं', shift: 'ँ' },
  KeyC: { normal: 'म', shift: 'ण' },
  KeyV: { normal: 'न', shift: 'ऩ' },
  KeyB: { normal: 'व', shift: 'ऴ' },
  KeyN: { normal: 'ल', shift: 'ळ' },
  KeyM: { normal: 'स', shift: 'श' },
  Comma: { normal: ',', shift: 'ष' },
  Period: { normal: '.', shift: '।' },
  Slash: { normal: 'य', shift: 'य़' },
};

export const FINGER_COLORS: Record<Finger, { bg: string; border: string; text: string; lightBg: string; activeGlow: string }> = {
  leftPinky: { bg: 'bg-purple-600', border: 'border-purple-500', text: 'text-purple-700', lightBg: 'bg-purple-50/80', activeGlow: 'rgba(147, 51, 234, 0.35)' },
  leftRing: { bg: 'bg-indigo-600', border: 'border-indigo-500', text: 'text-indigo-700', lightBg: 'bg-indigo-50/80', activeGlow: 'rgba(79, 70, 229, 0.35)' },
  leftMiddle: { bg: 'bg-blue-600', border: 'border-blue-500', text: 'text-blue-700', lightBg: 'bg-blue-50/80', activeGlow: 'rgba(37, 99, 235, 0.35)' },
  leftIndex: { bg: 'bg-emerald-600', border: 'border-emerald-500', text: 'text-emerald-700', lightBg: 'bg-emerald-50/80', activeGlow: 'rgba(5, 150, 105, 0.35)' },
  leftThumb: { bg: 'bg-amber-600', border: 'border-amber-500', text: 'text-amber-700', lightBg: 'bg-amber-50/80', activeGlow: 'rgba(217, 119, 6, 0.35)' },
  rightThumb: { bg: 'bg-amber-600', border: 'border-amber-500', text: 'text-amber-700', lightBg: 'bg-amber-50/80', activeGlow: 'rgba(217, 119, 6, 0.35)' },
  rightIndex: { bg: 'bg-teal-600', border: 'border-teal-500', text: 'text-teal-700', lightBg: 'bg-teal-50/80', activeGlow: 'rgba(13, 148, 136, 0.35)' },
  rightMiddle: { bg: 'bg-sky-600', border: 'border-sky-500', text: 'text-sky-700', lightBg: 'bg-sky-50/80', activeGlow: 'rgba(2, 132, 199, 0.35)' },
  rightRing: { bg: 'bg-violet-600', border: 'border-violet-500', text: 'text-violet-700', lightBg: 'bg-violet-50/80', activeGlow: 'rgba(124, 58, 237, 0.35)' },
  rightPinky: { bg: 'bg-pink-600', border: 'border-pink-500', text: 'text-pink-700', lightBg: 'bg-pink-50/80', activeGlow: 'rgba(219, 39, 119, 0.35)' },
};

export const FINGER_NAMES: Record<Finger, string> = {
  leftPinky: 'Left Pinky',
  leftRing: 'Left Ring',
  leftMiddle: 'Left Middle',
  leftIndex: 'Left Index',
  leftThumb: 'Left Thumb',
  rightThumb: 'Right Thumb',
  rightIndex: 'Right Index',
  rightMiddle: 'Right Middle',
  rightRing: 'Right Ring',
  rightPinky: 'Right Pinky',
};

export interface CharMapping {
  code: string;
  key: string;
  finger: Finger;
  hand: Hand;
  shiftRequired: boolean;
  shiftCode?: string;
  shiftFinger?: Finger;
}

const CHAR_TO_MAPPING: Record<string, CharMapping> = {};

// Build QWERTY mapping
for (const row of QWERTY_ROWS) {
  for (const key of row) {
    const lower = key.label.length === 1 ? key.label.toLowerCase() : key.label;
    if (!CHAR_TO_MAPPING[lower]) {
      CHAR_TO_MAPPING[lower] = {
        code: key.code,
        key: lower,
        finger: key.finger,
        hand: key.hand,
        shiftRequired: false,
      };
    }

    if (key.code.startsWith('Key')) {
      const upper = key.label.toUpperCase();
      const shiftHand: Hand = key.hand === 'left' ? 'right' : 'left';
      CHAR_TO_MAPPING[upper] = {
        code: key.code,
        key: upper,
        finger: key.finger,
        hand: key.hand,
        shiftRequired: true,
        shiftCode: shiftHand === 'left' ? 'ShiftLeft' : 'ShiftRight',
        shiftFinger: shiftHand === 'left' ? 'leftPinky' : 'rightPinky',
      };
    }

    if (key.shiftLabel && key.shiftLabel !== key.label) {
      const shiftHand: Hand = key.hand === 'left' ? 'right' : 'left';
      CHAR_TO_MAPPING[key.shiftLabel] = {
        code: key.code,
        key: key.shiftLabel,
        finger: key.finger,
        hand: key.hand,
        shiftRequired: true,
        shiftCode: shiftHand === 'left' ? 'ShiftLeft' : 'ShiftRight',
        shiftFinger: shiftHand === 'left' ? 'leftPinky' : 'rightPinky',
      };
    }
  }
}

// Add Hindi InScript Devanagari mappings to table
for (const [code, { normal, shift }] of Object.entries(HINDI_INSCRIPT_MAPPING)) {
  const def = getKeyDefinition(code);
  if (def) {
    if (!CHAR_TO_MAPPING[normal]) {
      CHAR_TO_MAPPING[normal] = {
        code,
        key: normal,
        finger: def.finger,
        hand: def.hand,
        shiftRequired: false,
      };
    }

    if (!CHAR_TO_MAPPING[shift]) {
      const shiftHand: Hand = def.hand === 'left' ? 'right' : 'left';
      CHAR_TO_MAPPING[shift] = {
        code,
        key: shift,
        finger: def.finger,
        hand: def.hand,
        shiftRequired: true,
        shiftCode: shiftHand === 'left' ? 'ShiftLeft' : 'ShiftRight',
        shiftFinger: shiftHand === 'left' ? 'leftPinky' : 'rightPinky',
      };
    }
  }
}

// Hindi Purnaviram (।)
CHAR_TO_MAPPING['।'] = {
  code: 'Period',
  key: '।',
  finger: 'rightRing',
  hand: 'right',
  shiftRequired: true,
  shiftCode: 'ShiftLeft',
  shiftFinger: 'leftPinky',
};

CHAR_TO_MAPPING[' '] = {
  code: 'Space',
  key: ' ',
  finger: 'rightThumb',
  hand: 'right',
  shiftRequired: false,
};

CHAR_TO_MAPPING['\n'] = {
  code: 'Enter',
  key: '\n',
  finger: 'rightPinky',
  hand: 'right',
  shiftRequired: false,
};

// Helper to translate a physical QWERTY code & shift status to Hindi InScript character
export function translateToInScriptHindi(code: string, isShift: boolean): string | null {
  if (code === 'Space') return ' ';
  if (code === 'Enter') return '\n';
  const mapping = HINDI_INSCRIPT_MAPPING[code];
  if (mapping) {
    return isShift ? mapping.shift : mapping.normal;
  }
  return null;
}

export function getCharMapping(char: string): CharMapping | undefined {
  return CHAR_TO_MAPPING[char];
}

export function getKeyDefinition(code: string): KeyDefinition | undefined {
  for (const row of QWERTY_ROWS) {
    const found = row.find((k) => k.code === code);
    if (found) return found;
  }
  return undefined;
}

export function getKeyboardRowsForLayout(layout: KeyboardLayoutMode): KeyDefinition[][] {
  if (layout === 'qwerty') {
    return QWERTY_ROWS;
  }

  // Devanagari InScript layout representation
  return QWERTY_ROWS.map((row) =>
    row.map((key) => {
      const hindi = HINDI_INSCRIPT_MAPPING[key.code];
      if (hindi) {
        return {
          ...key,
          label: hindi.normal,
          shiftLabel: hindi.shift,
        };
      }
      return key;
    })
  );
}
