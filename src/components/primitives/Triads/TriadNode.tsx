import { useState, useCallback } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { NOTE_COLORS, NOTE_ES } from '../../../data/notes';
import type { NaturalNote } from '../../../types/music';
import styles from './Triads.module.css';

interface Props {
  note: NaturalNote;
  index: number;
  cx: number;
  cy: number;
  r: number;
  onHover: (note: NaturalNote | null) => void;
}

export default function TriadNode({ note, index, cx, cy, r, onHover }: Props) {
  const [hovered, setHovered] = useState(false);
  const { playNote } = useAudioEngine();

  const angle = (index * (360 / 7) - 90) * Math.PI / 180;
  const x = cx + r * Math.cos(angle);
  const y = cy + r * Math.sin(angle);
  const labelR = r + 34;

  const handleEnter = useCallback(() => {
    setHovered(true);
    onHover(note);
    playNote(note, 4, 2);
  }, [note, onHover, playNote]);

  const handleLeave = useCallback(() => {
    setHovered(false);
    onHover(null);
  }, [onHover]);

  return (
    <g
      className={styles.node}
      style={{
        transformOrigin: `${x}px ${y}px`,
        transform: hovered ? 'scale(1.15)' : undefined,
      }}
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
        fill="#6b6560" fontSize={10}
      >
        {NOTE_ES[note]}
      </text>
    </g>
  );
}
