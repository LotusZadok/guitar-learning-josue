import { useMemo, useState, useCallback, useEffect, type KeyboardEvent } from 'react';
import type { CircleNoteData } from '../data/processSteps';
import { NOTE_TO_POS } from '../data/processSteps';
import { useAudioEngine } from '../../../../hooks/useAudioEngine';
import styles from './ChromaticCircleAnimated.module.css';

interface Props {
  notes: CircleNoteData[];
  arrow?: { fromPos: number; toPos: number };
  compact?: boolean;
  playOnClick?: boolean;
  inlineClearButton?: boolean;
  markedNotes?: string[];
  onMarkedNotesChange?: (notes: string[]) => void;
}

const ENHARMONIC_MAP: Record<string, { name: string; octaveAdj: number }> = {
  'Cb': { name: 'B', octaveAdj: -1 },
  'Fb': { name: 'E', octaveAdj: 0 },
  'E#': { name: 'F', octaveAdj: 0 },
  'B#': { name: 'C', octaveAdj: 1 },
};

function resolveNote(noteName: string): { name: string; octave: number } {
  const mapped = ENHARMONIC_MAP[noteName];
  if (mapped) return { name: mapped.name, octave: 4 + mapped.octaveAdj };
  return { name: noteName, octave: 4 };
}

const RADIUS = 140;
const CENTER = 200;
const NODE_R = 22;

function posToXY(pos: number) {
  const angle = ((pos * 30) - 90) * (Math.PI / 180);
  return { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) };
}

const STATE_COLORS: Record<string, { fill: string; text: string }> = {
  neutral:     { fill: 'var(--ink)', text: 'var(--muted)' },
  tonica:      { fill: 'var(--red)', text: 'var(--paper)' },
  highlighted: { fill: 'var(--amber)', text: 'var(--ink)' },
  natural:     { fill: 'color-mix(in srgb, var(--paper) 12%, transparent)', text: 'var(--paper)' },
  userPicked:  { fill: 'var(--surface-2)', text: 'var(--paper)' },
};

function arcPath(fromPos: number, toPos: number): string {
  const from = posToXY(fromPos);
  const to = posToXY(toPos);
  const midR = RADIUS * 0.6;
  const midAngle = (((fromPos + toPos) / 2) * 30 - 90) * (Math.PI / 180);
  const cx = CENTER + midR * Math.cos(midAngle);
  const cy = CENTER + midR * Math.sin(midAngle);
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

export default function ChromaticCircleAnimated({ notes, arrow, compact, playOnClick = false, inlineClearButton = false, markedNotes, onMarkedNotesChange }: Props) {
  const size = compact ? 280 : 400;
  const isControlled = markedNotes !== undefined;
  const [picked, setPicked] = useState<Set<number>>(new Set());
  const { playNote } = useAudioEngine();

  useEffect(() => {
    if (!isControlled) return;
    const next = new Set<number>();
    for (const name of markedNotes!) {
      const pos = NOTE_TO_POS[name];
      if (pos !== undefined) next.add(pos);
    }
    setPicked(next);
  }, [isControlled, markedNotes]);

  const toggleNote = useCallback((pos: number) => {
    const label = notes[pos]?.label;
    if (playOnClick && label) {
      const { name, octave } = resolveNote(label);
      playNote(name, octave, 1.5);
    }
    if (isControlled && onMarkedNotesChange && label) {
      const exists = markedNotes!.includes(label);
      onMarkedNotesChange(exists ? markedNotes!.filter(n => n !== label) : [...markedNotes!, label]);
      return;
    }
    setPicked(prev => {
      const next = new Set(prev);
      if (next.has(pos)) next.delete(pos);
      else next.add(pos);
      return next;
    });
  }, [notes, playNote, playOnClick, isControlled, markedNotes, onMarkedNotesChange]);

  const clearPicked = useCallback(() => {
    if (isControlled && onMarkedNotesChange) {
      onMarkedNotesChange([]);
      return;
    }
    setPicked(new Set());
  }, [isControlled, onMarkedNotesChange]);

  const arrowPath = useMemo(() => {
    if (!arrow) return null;
    return arcPath(arrow.fromPos, arrow.toPos);
  }, [arrow]);

  return (
    <div className={styles.wrap}>
      <svg
        viewBox="0 0 400 400"
        width={size}
        height={size}
        className={styles.svg}
      >
        {/* center circle */}
        <circle cx={CENTER} cy={CENTER} r={RADIUS - 35} fill="none" style={{ stroke: 'var(--rule)' }} strokeWidth={1} />

        {/* arrow arc */}
        {arrowPath && (
          <path
            d={arrowPath}
            fill="none"
            stroke="var(--amber)"
            strokeWidth={2}
            markerEnd="url(#arrowhead)"
            className={styles.arrowPath}
          />
        )}

        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="var(--amber)" />
          </marker>
        </defs>

        {/* note nodes */}
        {notes.map((note, i) => {
          const { x, y } = posToXY(i);
          const isPicked = picked.has(i);
          const effectiveState = isPicked ? 'userPicked' : note.state;
          const colors = STATE_COLORS[effectiveState] || STATE_COLORS.neutral;
          const handleKeyDown = (e: KeyboardEvent<SVGGElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleNote(i);
            }
          };
          return (
            <g
              key={i}
              className={styles.node}
              onClick={() => toggleNote(i)}
              tabIndex={0}
              role="button"
              aria-label={`Nota ${note.label}`}
              onKeyDown={handleKeyDown}
            >
              {/* hover/picked ring */}
              <circle
                cx={x}
                cy={y}
                r={NODE_R + 4}
                fill="none"
                stroke={isPicked ? 'var(--paper)' : 'transparent'}
                strokeWidth={2}
                className={styles.ring}
              />
              <circle
                cx={x}
                cy={y}
                r={NODE_R}
                fill={colors.fill}
                stroke={note.state === 'natural' && !isPicked ? 'var(--paper)' : 'none'}
                strokeWidth={note.state === 'natural' && !isPicked ? 1 : 0}
                className={styles.nodeCircle}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={colors.text}
                fontSize={note.label.length > 2 ? 11 : 13}
                fontFamily="'Bebas Neue', sans-serif"
                className={styles.nodeText}
              >
                {note.label}
              </text>
            </g>
          );
        })}
      </svg>

      {picked.size > 0 && (
        <button
          className={inlineClearButton ? styles.clearBtnInline : styles.clearBtn}
          onClick={clearPicked}
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
