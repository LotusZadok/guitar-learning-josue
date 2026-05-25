import { useState, useMemo, useCallback, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { ALL, NOTE_COLORS } from '../../../data/notes';
import type { ChromaticNote } from '../../../types/music';
import styles from './RelativasMenores.module.css';

interface Props {
  tonic: ChromaticNote;
}

const CX = 200, CY = 200, R = 140, NODE_R = 24;
const NOTE_DURATION = 1.4;

const FLAT_LABELS: Partial<Record<ChromaticNote, string>> = {
  'D#': 'E♭', 'G#': 'A♭', 'A#': 'B♭',
};
const noteLabel = (n: ChromaticNote) => FLAT_LABELS[n] ?? n;

function nodePos(idx: number): { x: number; y: number } {
  const rad = (idx * 30 - 90) * (Math.PI / 180);
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
}

const NODES = ALL.map((note, i) => ({ note, ...nodePos(i) }));

export default function RelativasMenores({ tonic }: Props) {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const [hovered, setHovered] = useState<ChromaticNote | null>(null);
  const { playNote } = useAudioEngine();

  const relativeMinor = useMemo<ChromaticNote>(() => {
    return ALL[(ALL.indexOf(tonic) - 3 + 12) % 12];
  }, [tonic]);

  const tonicP = nodePos(ALL.indexOf(tonic));
  const relP = nodePos(ALL.indexOf(relativeMinor));
  const arcPath = `M ${tonicP.x} ${tonicP.y} Q ${CX} ${CY} ${relP.x} ${relP.y}`;

  const handleAudio = useCallback(
    (note: ChromaticNote) => playNote(note, 4, NOTE_DURATION),
    [playNote],
  );

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox="0 0 400 400"
        role="img"
        aria-label={isDe
          ? `Chromatischer Kreis: ${noteLabel(tonic)}-Dur und seine Moll-Paralleltonart ${noteLabel(relativeMinor)}-Moll teilen dieselben Vorzeichen`
          : `Círculo cromático: ${noteLabel(tonic)} mayor y su relativa ${noteLabel(relativeMinor)} menor comparten la misma armadura`}
      >
        {/* Interior arc between tonic and relative minor */}
        <path
          d={arcPath}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={1.5}
          opacity={0.45}
          strokeDasharray="4 3"
        />

        {NODES.map(({ note, x, y }) => {
          const isTonic = note === tonic;
          const isRelative = note === relativeMinor;
          const isHovered = hovered === note;
          const highlighted = isTonic || isRelative;

          // Reunión 24/5/26: monocromo salvo tónica + relativa (que son la lección)
          // y el nodo bajo hover. Color reservado para enfatizar.
          const fill = highlighted || isHovered ? NOTE_COLORS[note] : 'var(--surface)';
          const stroke = highlighted
            ? 'var(--paper)'
            : isHovered
            ? 'var(--amber)'
            : 'var(--rule)';
          const strokeWidth = highlighted ? 2.5 : 1;
          const textFill = highlighted || isHovered ? '#fff' : 'var(--text-body)';

          return (
            <g
              key={note}
              className={styles.node}
              style={{ transformOrigin: `${x}px ${y}px` }}
              tabIndex={0}
              role="button"
              aria-label={isDe
                ? `${noteLabel(note)}${isTonic ? ' (Dur-Tonika)' : isRelative ? ' (Moll-Paralleltonart)' : ''}: Ton abspielen`
                : `${noteLabel(note)}${isTonic ? ' (tónica mayor)' : isRelative ? ' (relativa menor)' : ''}: reproducir nota`}
              onMouseEnter={() => { setHovered(note); handleAudio(note); }}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(note)}
              onBlur={() => setHovered(null)}
              onTouchStart={(e) => { e.preventDefault(); setHovered(note); handleAudio(note); }}
              onTouchEnd={() => setTimeout(() => setHovered(null), 600)}
              onClick={() => handleAudio(note)}
              onKeyDown={(e: KeyboardEvent<SVGGElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleAudio(note);
                }
              }}
            >
              <circle cx={x} cy={y} r={NODE_R} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
              <text
                x={x}
                y={y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.noteText}
                fill={textFill}
              >
                {noteLabel(note)}
              </text>
            </g>
          );
        })}

        {/* Center label */}
        <text x={CX} y={CY - 7} textAnchor="middle" className={styles.centerLabel}>
          {isDe ? '−3 Ht.' : '−3 s.t.'}
        </text>
        <text x={CX} y={CY + 11} textAnchor="middle" className={styles.centerSub}>
          {isDe ? 'Dur → Moll' : 'mayor → menor'}
        </text>
      </svg>
    </div>
  );
}
