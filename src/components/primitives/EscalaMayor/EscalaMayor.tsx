import { useCallback, useMemo, type KeyboardEvent } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { ALL, NOTE_COLORS, NOTE_ES } from '../../../data/notes';
import { majorScaleSpelled } from '../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../types/music';
import styles from './EscalaMayor.module.css';

// Major scale: positions 0, 2, 4, 5, 7, 9, 11, plus closing octave at 12.
// Tonic (T): 0, 12. Stable (III, V): 4, 7. Intermediate (II, VI): 2, 9. Tense (IV, VII): 5, 11.
// Chromatic off-scale degrees: 1, 3, 6, 8, 10.

const SCALE_POSITIONS = [0, 2, 4, 5, 7, 9, 11, 12] as const;
const GRADE_LABELS = ['T', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'T'] as const;
const STABLE_POSITIONS = new Set<number>([4, 7]);
const INTERMEDIATE_POSITIONS = new Set<number>([2, 9]);
const TENSE_POSITIONS = new Set<number>([5, 11]);

// Direction arrows for non-stable degrees: 'up' = resolves toward higher pitch, 'down' = lower.
const ARROW_DIRS: Partial<Record<string, ReadonlyArray<'up' | 'down'>>> = {
  II:  ['up', 'down'],
  IV:  ['down'],
  VI:  ['up', 'down'],
  VII: ['up', 'down'],
};
const PATTERN: ReadonlyArray<'T' | 'S'> = ['T', 'T', 'S', 'T', 'T', 'T', 'S'];

const NODE_COUNT = 13;
const SVG_W = 560;
const SVG_H = 180;
const PAD_X = 32;
const STEP_X = (SVG_W - 2 * PAD_X) / (NODE_COUNT - 1);
const NODE_Y = 100;

interface NodeData {
  position: number;
  cx: number;
  chromatic: ChromaticNote;
  octaveAdj: number;
  scaleIdx: number | null;
  spelled: string | null;
  grade: string | null;
  role: 'tonic' | 'stable' | 'intermediate' | 'tense' | 'chromatic';
}

export default function EscalaMayor() {
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();

  const nodes = useMemo<NodeData[]>(() => {
    const tonicIdx = ALL.indexOf(tonic);
    const spelledScale = majorScaleSpelled(tonic);
    const scaleByPos = new Map<number, number>();
    SCALE_POSITIONS.forEach((p, i) => scaleByPos.set(p, i));

    return Array.from({ length: NODE_COUNT }, (_, p): NodeData => {
      const cx = PAD_X + p * STEP_X;
      const absChromIdx = (tonicIdx + p) % 12;
      const chromatic = ALL[absChromIdx];
      const octaveAdj = Math.floor((tonicIdx + p) / 12);
      const scaleIdx = scaleByPos.get(p) ?? null;
      const spelled = scaleIdx !== null ? spelledScale[scaleIdx % 7] : null;
      const grade = scaleIdx !== null ? GRADE_LABELS[scaleIdx] : null;

      let role: NodeData['role'] = 'chromatic';
      if (p === 0 || p === 12) role = 'tonic';
      else if (STABLE_POSITIONS.has(p)) role = 'stable';
      else if (INTERMEDIATE_POSITIONS.has(p)) role = 'intermediate';
      else if (TENSE_POSITIONS.has(p)) role = 'tense';

      return { position: p, cx, chromatic, octaveAdj, scaleIdx, spelled, grade, role };
    });
  }, [tonic]);

  const handlePlay = useCallback(
    (chromatic: ChromaticNote, octaveAdj: number) => {
      playNote(chromatic, 4 + octaveAdj, 1.4);
    },
    [playNote],
  );

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        role="img"
        aria-label={`Escala mayor de ${NOTE_ES[tonic]}`}
      >
        <defs>
          <marker
            id="scale-dir-arrow"
            markerWidth="5"
            markerHeight="5"
            refX="5"
            refY="2.5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M 0 0 L 5 2.5 L 0 5 Z" fill="var(--muted)" />
          </marker>
        </defs>

        {/* Pattern T/S labels between consecutive scale notes */}
        {PATTERN.map((step, i) => {
          const fromPos = SCALE_POSITIONS[i];
          const toPos = SCALE_POSITIONS[i + 1];
          const x = (PAD_X + fromPos * STEP_X + PAD_X + toPos * STEP_X) / 2;
          return (
            <text
              key={i}
              x={x}
              y={32}
              textAnchor="middle"
              className={styles.patternLabel}
            >
              {step}
            </text>
          );
        })}

        {/* Subtle baseline rule between nodes */}
        <line
          x1={PAD_X}
          y1={NODE_Y}
          x2={SVG_W - PAD_X}
          y2={NODE_Y}
          className={styles.baseline}
        />

        {nodes.map((n) => (
          <ScaleNode key={n.position} data={n} onPlay={handlePlay} />
        ))}
      </svg>
    </div>
  );
}

interface ScaleNodeProps {
  data: NodeData;
  onPlay: (chromatic: ChromaticNote, octaveAdj: number) => void;
}

function ScaleNode({ data, onPlay }: ScaleNodeProps) {
  const { cx, chromatic, octaveAdj, role, spelled, grade } = data;

  const radius =
    role === 'tonic' ? 22 :
    role === 'chromatic' ? 11 :
    18;
  const opacity = role === 'chromatic' ? 0.2 : 1;
  const fill =
    role === 'chromatic' ? NOTE_COLORS[chromatic] :
    role === 'intermediate' ? 'var(--diatonic-medium)' :
    role === 'tense' ? 'var(--diatonic-tense)' :
    'var(--diatonic-stable)'; // tonic + stable
  const isOnScale = role !== 'chromatic';

  const handleEnter = useCallback(() => onPlay(chromatic, octaveAdj), [chromatic, octaveAdj, onPlay]);
  const handleKey = useCallback(
    (e: KeyboardEvent<SVGGElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPlay(chromatic, octaveAdj);
      }
    },
    [chromatic, octaveAdj, onPlay],
  );

  return (
    <g
      className={styles.node}
      tabIndex={0}
      role="button"
      aria-label={`${NOTE_ES[chromatic]}${grade ? ` · grado ${grade}` : ' · cromática'}`}
      onFocus={handleEnter}
      onKeyDown={handleKey}
    >
      {/* Hit area: larger transparent circle for easier hover/click */}
      <circle
        cx={cx}
        cy={NODE_Y}
        r={Math.max(radius + 6, 18)}
        fill="transparent"
        onMouseEnter={handleEnter}
      />

      {/* Spelled note name above (scale notes only) */}
      {spelled && (
        <text x={cx} y={NODE_Y - radius - 14} className={styles.noteName}>
          {spelled}
        </text>
      )}

      {/* Direction arrows for tense/intermediate nodes */}
      {grade && ARROW_DIRS[grade]?.map((dir, i) => {
        const y1 = dir === 'up' ? NODE_Y - radius - 4 : NODE_Y + radius + 4;
        const y2 = dir === 'up' ? NODE_Y - radius - 16 : NODE_Y + radius + 16;
        return (
          <path
            key={`arrow-${dir}-${i}`}
            d={`M ${cx} ${y1} L ${cx} ${y2}`}
            stroke="var(--muted)"
            strokeWidth={1}
            fill="none"
            markerEnd="url(#scale-dir-arrow)"
            aria-hidden="true"
          />
        );
      })}

      {/* Visible node */}
      <circle
        cx={cx}
        cy={NODE_Y}
        r={radius}
        fill={fill}
        opacity={opacity}
        stroke={role === 'tonic' ? 'var(--paper)' : 'none'}
        strokeWidth={role === 'tonic' ? 2 : 0}
      />

      {/* Inner letter (Signature Component): only on scale nodes */}
      {isOnScale && spelled && (
        <text
          x={cx}
          y={NODE_Y + 1}
          className={role === 'tonic' ? styles.innerLetterLarge : styles.innerLetter}
        >
          {spelled}
        </text>
      )}

      {/* Grade label below (scale notes only) */}
      {grade && (
        <text x={cx} y={NODE_Y + radius + 22} className={styles.gradeLabel}>
          {grade}
        </text>
      )}
    </g>
  );
}
