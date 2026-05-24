import { useState, useCallback, type KeyboardEvent } from 'react';
import { NOTE_COLORS, NOTE_ES } from '../../../data/notes';
import { noteShort } from '../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../types/music';
import styles from './ChromaticCircle.module.css';

interface ChromaticNodeProps {
  note: ChromaticNote;
  index: number;
  cx: number;
  cy: number;
  r: number;
  onPlay: () => void;
}

export default function ChromaticNode({ note, index, cx, cy, r, onPlay }: ChromaticNodeProps) {
  const [hovered, setHovered] = useState(false);

  const angle = (index * 30 - 90) * Math.PI / 180;
  const x = cx + r * Math.cos(angle);
  const y = cy + r * Math.sin(angle);
  const isNat = !note.includes('#');
  const labelR = r + 32;

  const handleEnter = useCallback(() => {
    setHovered(true);
    onPlay();
  }, [onPlay]);

  const handleLeave = useCallback(() => {
    setHovered(false);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPlay();
    }
  }, [onPlay]);

  return (
    <g
      className={styles.node}
      style={{ transformOrigin: `${x}px ${y}px` }}
      tabIndex={0}
      role="button"
      aria-label={`Nota ${NOTE_ES[note]}`}
      onFocus={handleEnter}
      onBlur={handleLeave}
      onKeyDown={handleKeyDown}
    >
      <circle
        className={styles.hit}
        cx={x} cy={y} r={30}
        fill="transparent"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      />
      {/* Reunión 24/5/26: monocromo en reposo, color solo en hover. */}
      <line
        x1={cx} y1={cy} x2={x} y2={y}
        stroke={hovered ? NOTE_COLORS[note] : 'var(--rule)'}
        strokeWidth={hovered ? 2 : 0.5}
        opacity={hovered ? 0.5 : 0.15}
      />
      <circle
        cx={x} cy={y}
        r={hovered ? (isNat ? 26 : 21) : (isNat ? 22 : 17)}
        fill={hovered ? NOTE_COLORS[note] : 'var(--surface)'}
        opacity={hovered ? (isNat ? 1 : 0.7) : (isNat ? 1 : 0.5)}
        stroke={hovered ? '#fff' : 'var(--rule)'}
        strokeWidth={hovered ? 2 : 1}
      />
      <text
        x={x} y={y + 1}
        textAnchor="middle" dominantBaseline="middle"
        fill="#fff" fontSize={isNat ? 15 : 11} fontWeight={700}
      >
        {noteShort(note)}
      </text>
      <text
        x={cx + labelR * Math.cos(angle)}
        y={cy + labelR * Math.sin(angle)}
        textAnchor="middle" dominantBaseline="middle"
        style={{ fill: 'var(--muted)' }} fontSize={9}
      >
        {NOTE_ES[note]}
      </text>
    </g>
  );
}
