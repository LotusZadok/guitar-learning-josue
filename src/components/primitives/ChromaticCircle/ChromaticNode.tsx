import { useState, useCallback } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
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
}

export default function ChromaticNode({ note, index, cx, cy, r }: ChromaticNodeProps) {
  const [hovered, setHovered] = useState(false);
  const { playNote } = useAudioEngine();

  const angle = (index * 30 - 90) * Math.PI / 180;
  const x = cx + r * Math.cos(angle);
  const y = cy + r * Math.sin(angle);
  const isNat = !note.includes('#');
  const labelR = r + 32;

  const handleEnter = useCallback(() => {
    setHovered(true);
    playNote(note, 4, 2);
  }, [note, playNote]);

  const handleLeave = useCallback(() => {
    setHovered(false);
  }, []);

  return (
    <g className={styles.node} style={{ transformOrigin: `${x}px ${y}px` }}>
      <circle
        className={styles.hit}
        cx={x} cy={y} r={30}
        fill="transparent"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      />
      <line
        x1={cx} y1={cy} x2={x} y2={y}
        stroke={NOTE_COLORS[note]}
        strokeWidth={hovered ? 2 : 0.5}
        opacity={hovered ? 0.5 : 0.15}
      />
      <circle
        cx={x} cy={y}
        r={hovered ? (isNat ? 26 : 21) : (isNat ? 22 : 17)}
        fill={NOTE_COLORS[note]}
        opacity={isNat ? 1 : 0.7}
        stroke={hovered ? '#fff' : 'none'}
        strokeWidth={hovered ? 2 : 0}
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
        fill="#6b6560" fontSize={9}
      >
        {NOTE_ES[note]}
      </text>
    </g>
  );
}
