import { useState, useCallback, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { NOTE_COLORS, NOTE_ES } from '../../../data/notes';
import type { NaturalNote } from '../../../types/music';
import styles from './Triads.module.css';

const NOTE_DE: Record<NaturalNote, string> = {
  C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', A: 'A', B: 'H',
};

interface Props {
  note: NaturalNote;
  index: number;
  cx: number;
  cy: number;
  r: number;
  onHover: (note: NaturalNote | null) => void;
  onPlay?: () => void;
}

export default function TriadNode({ note, index, cx, cy, r, onHover, onPlay }: Props) {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const [hovered, setHovered] = useState(false);
  const { playNote } = useAudioEngine();

  const angle = (index * (360 / 7) - 90) * Math.PI / 180;
  const x = cx + r * Math.cos(angle);
  const y = cy + r * Math.sin(angle);
  const labelR = r + 34;

  const handleEnter = useCallback(() => {
    setHovered(true);
    onHover(note);
    if (onPlay) onPlay();
    else playNote(note, 4, 2);
  }, [note, onHover, onPlay, playNote]);

  const handleLeave = useCallback(() => {
    setHovered(false);
    onHover(null);
  }, [onHover]);

  const handleKeyDown = useCallback((e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onPlay) onPlay();
      else playNote(note, 4, 2);
    }
  }, [note, onPlay, playNote]);

  return (
    <g
      className={styles.node}
      style={{
        transformOrigin: `${x}px ${y}px`,
        transform: hovered ? 'scale(1.15)' : undefined,
      }}
      tabIndex={0}
      role="button"
      aria-label={isDe ? `Dreiklang von ${NOTE_DE[note]}` : `Tríada de ${NOTE_ES[note]}`}
      onFocus={handleEnter}
      onBlur={handleLeave}
      onKeyDown={handleKeyDown}
    >
      <circle
        className={styles.hit}
        cx={x} cy={y} r={32}
        fill="transparent"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      />
      <line
        x1={cx} y1={cy} x2={x} y2={y}
        stroke={NOTE_COLORS[note]}
        strokeWidth={hovered ? 2 : 0.5}
        opacity={hovered ? 0.4 : 0.12}
      />
      <circle
        cx={x} cy={y}
        r={hovered ? 28 : 24}
        fill={NOTE_COLORS[note]}
        stroke={hovered ? '#fff' : 'none'}
        strokeWidth={hovered ? 2 : 0}
      />
      <text
        x={x} y={y + 1}
        textAnchor="middle" dominantBaseline="middle"
        fill="#fff" fontSize={16} fontWeight={700}
      >
        {note}
      </text>
      <text
        x={cx + labelR * Math.cos(angle)}
        y={cy + labelR * Math.sin(angle)}
        textAnchor="middle" dominantBaseline="middle"
        style={{ fill: 'var(--muted)' }} fontSize={10}
      >
        {isDe ? NOTE_DE[note] : NOTE_ES[note]}
      </text>
    </g>
  );
}
