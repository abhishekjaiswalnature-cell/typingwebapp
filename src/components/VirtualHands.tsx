import React, { useEffect, useRef, useState } from 'react';
import { Finger, Hand } from '../types/typing';
import { coordinateRegistry, KeyRect } from '../services/coordinateRegistry';
import { getCharMapping, FINGER_COLORS, FINGER_NAMES } from '../services/keyboardMapping';

interface VirtualHandsProps {
  targetChar: string;
  nextChar?: string;
  activePressedCodes: Set<string>;
  typingSpeedWpm: number;
  reducedMotion?: boolean;
  showHands: boolean;
}

interface FingerPosition {
  x: number;
  y: number;
  restingX: number;
  restingY: number;
  isTarget: boolean;
  isSecondary: boolean;
  isTapping: boolean;
  finger: Finger;
  hand: Hand;
  label: string;
}

export const VirtualHands: React.FC<VirtualHandsProps> = ({
  targetChar,
  nextChar,
  activePressedCodes,
  typingSpeedWpm,
  reducedMotion = false,
  showHands = true,
}) => {
  const [containerSize, setContainerSize] = useState({ width: 960, height: 320 });
  const [currentPositions, setCurrentPositions] = useState<Record<Finger, { x: number; y: number }>>({
    leftPinky: { x: 0, y: 0 },
    leftRing: { x: 0, y: 0 },
    leftMiddle: { x: 0, y: 0 },
    leftIndex: { x: 0, y: 0 },
    leftThumb: { x: 0, y: 0 },
    rightThumb: { x: 0, y: 0 },
    rightIndex: { x: 0, y: 0 },
    rightMiddle: { x: 0, y: 0 },
    rightRing: { x: 0, y: 0 },
    rightPinky: { x: 0, y: 0 },
  });

  const animFrameRef = useRef<number | null>(null);
  const targetPositionsRef = useRef<Record<Finger, { x: number; y: number }>>(currentPositions);
  const currentPositionsRef = useRef<Record<Finger, { x: number; y: number }>>(currentPositions);

  useEffect(() => {
    const updateSize = () => {
      const dim = coordinateRegistry.getContainerDimensions();
      setContainerSize(dim);
    };

    updateSize();
    const unsubscribe = coordinateRegistry.subscribe(updateSize);
    return () => unsubscribe();
  }, []);

  const homeKeyCodes: Record<Finger, string> = {
    leftPinky: 'KeyA',
    leftRing: 'KeyS',
    leftMiddle: 'KeyD',
    leftIndex: 'KeyF',
    leftThumb: 'Space',
    rightThumb: 'Space',
    rightIndex: 'KeyJ',
    rightMiddle: 'KeyK',
    rightRing: 'KeyL',
    rightPinky: 'Semicolon',
  };

  const getHomeRect = (finger: Finger): KeyRect | undefined => {
    const code = homeKeyCodes[finger];
    const rect = coordinateRegistry.getKeyRect(code);
    if (!rect) return undefined;
    if (code === 'Space') {
      const isLeft = finger === 'leftThumb';
      return {
        ...rect,
        x: isLeft ? rect.x - rect.width * 0.22 : rect.x + rect.width * 0.22,
      };
    }
    return rect;
  };

  const targetMapping = getCharMapping(targetChar);
  const primaryFinger = targetMapping?.finger;
  const targetCode = targetMapping?.code;
  const shiftRequired = targetMapping?.shiftRequired;
  const shiftCode = targetMapping?.shiftCode;
  const shiftFinger = targetMapping?.shiftFinger;

  const nextMapping = nextChar ? getCharMapping(nextChar) : undefined;
  const nextFinger = nextMapping?.finger;
  const nextCode = nextMapping?.code;

  useEffect(() => {
    const newTargets: Record<Finger, { x: number; y: number }> = { ...currentPositionsRef.current };

    const fingers: Finger[] = [
      'leftPinky',
      'leftRing',
      'leftMiddle',
      'leftIndex',
      'leftThumb',
      'rightThumb',
      'rightIndex',
      'rightMiddle',
      'rightRing',
      'rightPinky',
    ];

    fingers.forEach((finger) => {
      const home = getHomeRect(finger);
      if (!home) return;

      if (finger === primaryFinger && targetCode) {
        const targetRect = coordinateRegistry.getKeyRect(targetCode);
        if (targetRect) {
          if (targetCode === 'Space') {
            const isLeft = finger === 'leftThumb';
            newTargets[finger] = {
              x: isLeft ? targetRect.x - targetRect.width * 0.22 : targetRect.x + targetRect.width * 0.22,
              y: targetRect.y,
            };
          } else {
            newTargets[finger] = { x: targetRect.x, y: targetRect.y };
          }
          return;
        }
      }

      if (finger === shiftFinger && shiftRequired && shiftCode) {
        const shiftRect = coordinateRegistry.getKeyRect(shiftCode);
        if (shiftRect) {
          newTargets[finger] = { x: shiftRect.x, y: shiftRect.y };
          return;
        }
      }

      if (finger === nextFinger && nextCode && finger !== primaryFinger) {
        const nextRect = coordinateRegistry.getKeyRect(nextCode);
        if (nextRect) {
          newTargets[finger] = {
            x: home.x + (nextRect.x - home.x) * 0.25,
            y: home.y + (nextRect.y - home.y) * 0.25,
          };
          return;
        }
      }

      newTargets[finger] = { x: home.x, y: home.y };
    });

    targetPositionsRef.current = newTargets;

    if (reducedMotion) {
      currentPositionsRef.current = newTargets;
      setCurrentPositions(newTargets);
      return;
    }

    const springLerp = (current: number, target: number, speed: number) => {
      return current + (target - current) * speed;
    };

    const lerpSpeed = Math.min(0.55, Math.max(0.2, 0.2 + (typingSpeedWpm / 140) * 0.3));

    const step = () => {
      let isSettled = true;
      const updated: Record<Finger, { x: number; y: number }> = { ...currentPositionsRef.current };

      fingers.forEach((f) => {
        const cur = currentPositionsRef.current[f] || { x: 0, y: 0 };
        const dest = targetPositionsRef.current[f] || cur;

        const dx = dest.x - cur.x;
        const dy = dest.y - cur.y;

        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          isSettled = false;
          updated[f] = {
            x: springLerp(cur.x, dest.x, lerpSpeed),
            y: springLerp(cur.y, dest.y, lerpSpeed),
          };
        } else {
          updated[f] = dest;
        }
      });

      currentPositionsRef.current = updated;
      setCurrentPositions({ ...updated });

      if (!isSettled) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
      }
    };

    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
    }
    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [targetChar, nextChar, typingSpeedWpm, reducedMotion, containerSize]);

  if (!showHands) return null;

  const fingerList: FingerPosition[] = (
    [
      'leftPinky',
      'leftRing',
      'leftMiddle',
      'leftIndex',
      'leftThumb',
      'rightThumb',
      'rightIndex',
      'rightMiddle',
      'rightRing',
      'rightPinky',
    ] as Finger[]
  ).map((finger) => {
    const isTarget = finger === primaryFinger;
    const isSecondary = Boolean(shiftRequired && finger === shiftFinger);
    const home = getHomeRect(finger) || { x: 0, y: 0, width: 40, height: 40, left: 0, top: 0 };
    const cur = currentPositions[finger] || { x: home.x, y: home.y };
    const hand: Hand = finger.startsWith('left') ? 'left' : 'right';
    const isTapping = activePressedCodes.has(targetCode || '') && isTarget;

    return {
      finger,
      hand,
      x: cur.x || home.x,
      y: cur.y || home.y,
      restingX: home.x,
      restingY: home.y,
      isTarget,
      isSecondary,
      isTapping,
      label: FINGER_NAMES[finger],
    };
  });

  const leftWristX = containerSize.width * 0.28;
  const leftWristY = containerSize.height + 95;

  const rightWristX = containerSize.width * 0.72;
  const rightWristY = containerSize.height + 95;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-visible"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full overflow-visible"
        viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
      >
        <defs>
          <filter id="glow-target-light" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="wristGradLeftLight" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.4" />
          </radialGradient>
          <radialGradient id="wristGradRightLight" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* Left Palm Outline */}
        <path
          d={`M ${leftWristX - 75} ${leftWristY} Q ${leftWristX} ${leftWristY - 38} ${leftWristX + 75} ${leftWristY} L ${leftWristX + 55} ${leftWristY + 35} L ${leftWristX - 55} ${leftWristY + 35} Z`}
          fill="url(#wristGradLeftLight)"
          stroke="#94A3B8"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Right Palm Outline */}
        <path
          d={`M ${rightWristX - 75} ${rightWristY} Q ${rightWristX} ${rightWristY - 38} ${rightWristX + 75} ${rightWristY} L ${rightWristX + 55} ${rightWristY + 35} L ${rightWristX - 55} ${rightWristY + 35} Z`}
          fill="url(#wristGradRightLight)"
          stroke="#94A3B8"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Articulated Finger Pathways */}
        {fingerList.map((f) => {
          const wristX = f.hand === 'left' ? leftWristX : rightWristX;
          const wristY = f.hand === 'left' ? leftWristY : rightWristY;

          const midX = (wristX + f.x) / 2;
          const midY = (wristY + f.y) / 2 - (f.isTarget ? 18 : 6);

          const strokeColor = f.isTarget
            ? 'rgba(5, 150, 105, 0.95)'
            : f.isSecondary
            ? 'rgba(217, 119, 6, 0.95)'
            : 'rgba(148, 163, 184, 0.45)';

          const strokeWidth = f.isTarget ? 3.5 : f.isSecondary ? 2.5 : 1.5;

          return (
            <g key={f.finger}>
              <path
                d={`M ${wristX} ${wristY - 20} Q ${midX} ${midY} ${f.x} ${f.y}`}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={f.isTarget ? undefined : '3 3'}
                opacity={f.isTarget ? 1 : 0.75}
              />

              {/* Trajectory Guide */}
              {f.isTarget && nextMapping && (
                <line
                  x1={f.x}
                  y1={f.y}
                  x2={coordinateRegistry.getKeyRect(nextMapping.code)?.x || f.x}
                  y2={coordinateRegistry.getKeyRect(nextMapping.code)?.y || f.y}
                  stroke="rgba(5, 150, 105, 0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="2 4"
                />
              )}

              {/* Fingertip Contact Pad */}
              <g
                transform={`translate(${f.x}, ${f.y}) scale(${f.isTapping ? 0.88 : 1})`}
                className="transition-transform duration-75"
              >
                {/* Active Target Pulse */}
                {f.isTarget && (
                  <circle
                    r="18"
                    fill="none"
                    stroke="rgba(5, 150, 105, 0.4)"
                    strokeWidth="2"
                    className="animate-ping"
                    style={{ animationDuration: '1.8s' }}
                  />
                )}

                {/* Outer Ring */}
                <circle
                  r={f.isTarget ? 13 : f.isSecondary ? 10 : 7}
                  fill={f.isTarget ? '#ECFDF5' : f.isSecondary ? '#FFFBEB' : '#F1F5F9'}
                  stroke={
                    f.isTarget
                      ? '#059669'
                      : f.isSecondary
                      ? '#D97706'
                      : '#94A3B8'
                  }
                  strokeWidth={f.isTarget ? 2.5 : 1.5}
                  filter={f.isTarget ? 'url(#glow-target-light)' : undefined}
                />

                {/* Core Node */}
                <circle
                  r={f.isTarget ? 5 : 3}
                  fill={f.isTarget ? '#059669' : f.isSecondary ? '#D97706' : '#64748B'}
                />

                {/* Finger Label */}
                {f.isTarget && (
                  <text
                    y="-18"
                    textAnchor="middle"
                    fill="#059669"
                    fontSize="11"
                    fontWeight="800"
                    className="font-mono tracking-tight"
                  >
                    {f.label.split(' ')[1]}
                  </text>
                )}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
