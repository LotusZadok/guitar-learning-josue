import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { ALL, NOTE_ES } from '../../../data/notes';
import type { ChromaticNote } from '../../../types/music';
import styles from './TensionResolucion.module.css';

// buildNodes: los 8 nodos del strip (7 grados + octava de T) para cualquier tónica.
// Posiciones (semitonos desde T), grados y roles son invariantes; solo cambia la nota.
// `majorScaleSpelled` devuelve string[] con glifos ♯/♭ — no tiene campo `.chromatic`,
// por lo que usamos ALL[(tonicIdx + pos) % 12] para obtener el ChromaticNote del audio.

interface TensionNode {
  pos: number;
  note: ChromaticNote;
  octaveAdj: number;
  grade: string;
  role: 'tonic' | 'stable' | 'intermediate' | 'tense';
}

const SCALE_POS   = [0, 2, 4, 5, 7, 9, 11, 12] as const;
const GRADE_NAMES = ['T', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'T'] as const;
const NODE_ROLES: TensionNode['role'][] = [
  'tonic', 'intermediate', 'stable', 'tense', 'stable', 'intermediate', 'tense', 'tonic',
];

function buildNodes(tonic: ChromaticNote): TensionNode[] {
  const tonicIdx = ALL.indexOf(tonic);
  return SCALE_POS.map((pos, i) => ({
    pos,
    note: ALL[(tonicIdx + pos) % 12],
    octaveAdj: pos === 12 ? 1 : 0,
    grade: GRADE_NAMES[i],
    role: NODE_ROLES[i],
  }));
}

// Las flechas de resolución del método. `kind` codifica la distancia interválica:
// 'straight' = 1 s.t. (resolución directa), 'curve' = 2 s.t. (salto).
// Grosor uniforme — el mensaje semántico está en la forma, no en el peso.
const ARROWS = [
  { id: 'd-c',   fromIdx: 1, toIdx: 0, width: 1.5, kind: 'curve'    },
  { id: 'd-e',   fromIdx: 1, toIdx: 2, width: 1.5, kind: 'curve'    },
  { id: 'f-e',   fromIdx: 3, toIdx: 2, width: 1.5, kind: 'straight' },
  { id: 'f-g',   fromIdx: 3, toIdx: 4, width: 1.5, kind: 'straight' },
  { id: 'a-g',   fromIdx: 5, toIdx: 4, width: 1.5, kind: 'curve'    },
  { id: 'b-c8',  fromIdx: 6, toIdx: 7, width: 1.5, kind: 'straight' },
] as const;

const SVG_W = 560;
const SVG_H = 220;
const PAD_X = 32;
const GRID_UNITS = 12;
const STEP_X = (SVG_W - 2 * PAD_X) / GRID_UNITS;
const NODE_Y = 150;
const RADIUS_TONIC = 22;
const RADIUS_STABLE = 18;
const RADIUS_TENSE = 18;
const ARC_BASELINE = NODE_Y - RADIUS_TONIC - 6; // top of node circle
const ARC_RISE = 52;        // how far above baseline the arc peaks
const ARPEGGIO_GAP_MS = 260;
const NOTE_DURATION = 1.4;
const FIRE_DEBOUNCE_MS = 150;

function nodeX(pos: number): number {
  return PAD_X + pos * STEP_X;
}

function arrowPath(originX: number, destX: number, kind: 'straight' | 'curve'): string {
  const startY = ARC_BASELINE;
  if (kind === 'straight') {
    // Grados tensos (4ª, 7ª): línea recta horizontal.
    return `M ${originX} ${startY} L ${destX} ${startY}`;
  }
  // Grados intermedios (2ª, 6ª): arco cuadrático proporcional a la distancia.
  const midX = (originX + destX) / 2;
  const peakY = startY - ARC_RISE;
  return `M ${originX} ${startY} Q ${midX} ${peakY} ${destX} ${startY}`;
}

export default function TensionResolucion() {
  const tonic = useUIStore((s) => s.tonic);
  const nodes = useMemo(() => buildNodes(tonic), [tonic]);
  const { playNote } = useAudioEngine();
  const lastFireRef = useRef<number>(0);
  const [playingArrow, setPlayingArrow] = useState<string | null>(null);

  const playSequence = useCallback(
    (fromIdx: number, toIdx: number, arrowId: string) => {
      const now = performance.now();
      if (now - lastFireRef.current < FIRE_DEBOUNCE_MS) return;
      lastFireRef.current = now;

      setPlayingArrow(arrowId);
      const from = nodes[fromIdx];
      const to = nodes[toIdx];
      playNote(from.note, 4 + from.octaveAdj, NOTE_DURATION);
      setTimeout(
        () => playNote(to.note, 4 + to.octaveAdj, NOTE_DURATION),
        ARPEGGIO_GAP_MS,
      );
      setTimeout(() => setPlayingArrow(null), ARPEGGIO_GAP_MS + NOTE_DURATION * 1000);
    },
    [playNote, nodes],
  );

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        role="img"
        aria-label={`Mapa de resoluciones de tensión en ${NOTE_ES[tonic]} mayor`}
      >
        <defs>
          <marker
            id="tension-arrowhead"
            markerWidth="6"
            markerHeight="6"
            refX="6"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L6,3 L0,6 Z" className={styles.arrowHead} />
          </marker>
        </defs>

        {/* Subtle baseline rule beneath nodes */}
        <line
          x1={PAD_X}
          y1={NODE_Y}
          x2={SVG_W - PAD_X}
          y2={NODE_Y}
          className={styles.baseline}
        />

        {/* Resolution arrows above the strip */}
        {ARROWS.map((a) => {
          const from = nodes[a.fromIdx];
          const to = nodes[a.toIdx];
          return (
            <ArrowPath
              key={a.id}
              d={arrowPath(nodeX(from.pos), nodeX(to.pos), a.kind)}
              width={a.width}
              ariaLabel={`Reproducir resolución de ${NOTE_ES[from.note]} a ${NOTE_ES[to.note]}`}
              onPlay={() => playSequence(a.fromIdx, a.toIdx, a.id)}
              isPlaying={playingArrow === a.id}
              isDimmed={playingArrow !== null && playingArrow !== a.id}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <ScaleNode key={`${n.pos}-${i}`} data={n} />
        ))}
      </svg>

      <ul className={styles.legend} aria-label="Convenciones del mapa">
        <li>
          <span className={`${styles.swatch} ${styles.swatchStraight}`} />
          4ª · 7ª (tensos)
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchCurve}`} />
          2ª · 6ª (intermedios)
        </li>
        <li>
          <span className={styles.swatchStable} />
          Estable
        </li>
        <li>
          <span className={styles.swatchIntermediate} />
          Intermedia
        </li>
        <li>
          <span className={styles.swatchTense} />
          Tensa
        </li>
      </ul>
    </div>
  );
}

interface ArrowPathProps {
  d: string;
  width: number;
  ariaLabel: string;
  onPlay: () => void;
  isPlaying?: boolean;
  isDimmed?: boolean;
}

function ArrowPath({ d, width, ariaLabel, onPlay, isPlaying, isDimmed }: ArrowPathProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent<SVGPathElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPlay();
      }
    },
    [onPlay],
  );

  const strokeColor = isPlaying ? 'var(--amber)' : undefined;
  const strokeWidth = isPlaying ? width + 1 : width;
  const opacity = isDimmed ? 0.25 : 1;

  return (
    <path
      d={d}
      className={styles.arrow}
      strokeWidth={strokeWidth}
      stroke={strokeColor}
      opacity={opacity}
      markerEnd="url(#tension-arrowhead)"
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      onClick={onPlay}
      onFocus={onPlay}
      onKeyDown={handleKey}
      style={{ transition: 'opacity 0.2s, stroke 0.15s' }}
    />
  );
}

interface ScaleNodeProps {
  data: TensionNode;
}

function ScaleNode({ data }: ScaleNodeProps) {
  const { pos, note, role } = data;
  const cx = nodeX(pos);
  const radius =
    role === 'tonic' ? RADIUS_TONIC :
    role === 'tense' ? RADIUS_TENSE :
    RADIUS_STABLE;
  const fill =
    role === 'tonic' || role === 'stable' ? 'var(--diatonic-stable)' :
    role === 'intermediate' ? 'var(--diatonic-medium)' :
    'var(--diatonic-tense)';
  const isLargeLetter = role === 'tonic';

  return (
    <g className={styles.node} aria-hidden="true">
      <circle
        cx={cx}
        cy={NODE_Y}
        r={radius}
        fill={fill}
        stroke={role === 'tonic' ? 'var(--paper)' : 'none'}
        strokeWidth={role === 'tonic' ? 2 : 0}
      />
      <text
        x={cx}
        y={NODE_Y + 1}
        className={isLargeLetter ? styles.innerLetterLarge : styles.innerLetter}
      >
        {note}
      </text>
      <text x={cx} y={NODE_Y + radius + 22} className={styles.gradeLabel}>
        {data.grade}
      </text>
    </g>
  );
}
