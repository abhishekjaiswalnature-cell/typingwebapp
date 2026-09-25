import React, { useEffect, useRef, useState } from 'react';
import { KEYBOARD_ROWS, FINGER_COLORS, getCharMapping, HINDI_INSCRIPT_MAPPING } from '../services/keyboardMapping';
import { coordinateRegistry } from '../services/coordinateRegistry';
import { KeyDefinition, KeyboardLayoutMode } from '../types/typing';

interface VirtualKeyboardProps {
  targetChar: string;
  activePressedCodes: Set<string>;
  errorCodes: Set<string>;
  correctCodes: Set<string>;
  showZones: boolean;
  onKeyClick?: (key: string, code: string) => void;
  speedWpm?: number;
  layoutMode?: KeyboardLayoutMode;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  targetChar,
  activePressedCodes,
  errorCodes,
  correctCodes,
  showZones,
  onKeyClick,
  layoutMode = 'qwerty',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [, setDimensionsReady] = useState(0);

  const targetMapping = getCharMapping(targetChar);
  const targetCode = targetMapping?.code;
  const shiftRequired = targetMapping?.shiftRequired;
  const shiftCode = targetMapping?.shiftCode;

  useEffect(() => {
    coordinateRegistry.registerContainer(containerRef.current);

    const handleResize = () => {
      coordinateRegistry.recalculate();
      setDimensionsReady((v) => v + 1);
    };

    window.addEventListener('resize', handleResize);
    const observer = new ResizeObserver(() => {
      coordinateRegistry.recalculate();
      setDimensionsReady((v) => v + 1);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const timer = setTimeout(() => {
      coordinateRegistry.recalculate();
      setDimensionsReady((v) => v + 1);
    }, 50);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const getKeyWidthClass = (unit: number) => {
    switch (unit) {
      case 1.5:
        return 'flex-[1.5] min-w-[42px] sm:min-w-[54px]';
      case 1.75:
        return 'flex-[1.75] min-w-[48px] sm:min-w-[62px]';
      case 2:
        return 'flex-[2] min-w-[56px] sm:min-w-[70px]';
      case 2.25:
        return 'flex-[2.25] min-w-[62px] sm:min-w-[78px]';
      case 2.75:
        return 'flex-[2.75] min-w-[76px] sm:min-w-[96px]';
      case 7.25:
        return 'flex-[7.25] min-w-[200px] sm:min-w-[320px]';
      default:
        return 'flex-1 min-w-[30px] sm:min-w-[44px]';
    }
  };

  const renderKey = (key: KeyDefinition) => {
    const isTarget = targetCode === key.code;
    const isShiftHelper = shiftRequired && shiftCode === key.code;
    const isPressed = activePressedCodes.has(key.code);
    const isError = errorCodes.has(key.code);
    const isCorrect = correctCodes.has(key.code);
    const fingerColor = FINGER_COLORS[key.finger];

    // Clean Tactile Light Theme Keycap styling
    let keycapStateClasses = 'bg-white text-slate-700 border-slate-300 shadow-[0_3px_0_0_#CBD5E1]';

    if (isPressed) {
      keycapStateClasses = 'translate-y-[2.5px] bg-slate-100 text-slate-900 border-slate-400 shadow-[0_0.5px_0_0_#94A3B8]';
    } else if (isCorrect) {
      keycapStateClasses = 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-[0_3px_0_0_#A7F3D0]';
    } else if (isError) {
      keycapStateClasses = 'bg-rose-50 text-rose-800 border-rose-400 shadow-[0_3px_0_0_#FECDD3] animate-shake';
    } else if (isTarget) {
      keycapStateClasses = `bg-emerald-50/90 text-slate-900 border-2 ${fingerColor.border} shadow-[0_3px_12px_rgba(16,185,129,0.25)] ring-2 ring-emerald-500/20 scale-[1.02] font-bold`;
    } else if (isShiftHelper) {
      keycapStateClasses = 'bg-amber-50 text-amber-900 border-2 border-amber-400 shadow-[0_3px_8px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/20';
    } else if (showZones) {
      keycapStateClasses = `border-slate-300 shadow-[0_3px_0_0_#CBD5E1] ${fingerColor.lightBg} text-slate-700`;
    }

    const isHindiMode = layoutMode === 'hindi-inscript' || /[\u0900-\u097F]/.test(targetChar);
    const hindiDef = isHindiMode ? HINDI_INSCRIPT_MAPPING[key.code] : undefined;

    return (
      <div
        key={key.code}
        ref={(el) => coordinateRegistry.registerKey(key.code, el)}
        onClick={() => onKeyClick?.(key.label.toLowerCase(), key.code)}
        className={`group relative flex h-11 sm:h-13 flex-col items-center justify-center rounded-xl border text-xs sm:text-base font-semibold transition-all duration-75 select-none cursor-pointer ${getKeyWidthClass(
          key.widthUnit
        )} ${keycapStateClasses}`}
        style={{
          boxSizing: 'border-box',
        }}
        data-code={key.code}
        aria-label={`${key.label} key, ${key.finger}`}
      >
        {/* Key Label: Hindi InScript Mode or Standard Dual/Single QWERTY */}
        {hindiDef ? (
          <div className="flex flex-col items-center leading-tight">
            <span
              className={`text-[13px] sm:text-[15px] font-bold ${
                isTarget ? 'text-slate-950 font-black' : 'text-slate-800'
              }`}
            >
              {shiftRequired ? hindiDef.shift : hindiDef.normal}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
              {key.label}
            </span>
          </div>
        ) : key.shiftLabel && key.shiftLabel !== key.label ? (
          <div className="flex flex-col items-center leading-none">
            <span
              className={`text-[10px] sm:text-[11px] ${
                isTarget && shiftRequired ? 'text-amber-700 font-bold' : 'text-slate-400'
              }`}
            >
              {key.shiftLabel}
            </span>
            <span
              className={`text-[13px] sm:text-[15px] ${
                isTarget && !shiftRequired ? 'text-slate-900 font-extrabold' : 'text-slate-700'
              }`}
            >
              {key.label}
            </span>
          </div>
        ) : (
          <span
            className={`text-[13px] sm:text-[15px] tracking-wide ${
              isTarget ? 'text-slate-900 font-extrabold' : ''
            }`}
          >
            {key.code === 'Space' ? (isHindiMode ? 'Space' : '—') : key.label}
          </span>
        )}

        {/* Tactile ridges on F and J */}
        {key.bump && (
          <span
            className={`absolute bottom-1.5 w-3 sm:w-4 h-[2px] rounded-full transition-colors ${
              isTarget ? 'bg-emerald-600' : 'bg-slate-400'
            }`}
          />
        )}

        {/* Home row indicator dot */}
        {key.homeKey && !key.bump && (
          <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-slate-300" />
        )}

        {/* Shift indicator flag */}
        {isShiftHelper && (
          <span className="absolute -top-2 -right-1 px-1.5 py-0.5 bg-amber-500 text-[8px] font-bold text-white rounded shadow">
            HOLD
          </span>
        )}

        {/* Finger indicator tag on target key */}
        {isTarget && (
          <span
            className={`absolute -top-3 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-tight text-white shadow-sm uppercase ${fingerColor.bg}`}
          >
            {key.finger.replace('left', 'L-').replace('right', 'R-')}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto rounded-3xl bg-slate-100/90 p-3 sm:p-5 border border-slate-300/80 shadow-[0_12px_40px_rgb(0,0,0,0.08)] select-none"
    >
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={`row-${rowIdx}`} className="flex w-full gap-1 sm:gap-2 justify-center">
            {row.map(renderKey)}
          </div>
        ))}
      </div>
    </div>
  );
};
