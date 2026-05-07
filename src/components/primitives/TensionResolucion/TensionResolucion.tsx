import { useCallback, useRef, type KeyboardEvent } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { NOTE_COLORS, NOTE_ES } from '../../../data/notes';
import type { ChromaticNote } from '../../../types/music';
import styles from './TensionResolucion.module.css';

// Sección 05 fija en C mayor: el eje Y de la pedagogía es la *función* de cada
// grado, no la transposición. La configurabilidad de tonalidad ya vive en §1.4.

const NODES = [
  { pos: 0,  note: 'C' as ChromaticNote, octaveAdj: 0, grade: 'T',   role: 'tonic'  as const },
  { pos: 2,  note: 'D' as ChromaticNote, octaveAdj: 0, grade: 'II',  role: 'tense'  as const },
  { pos: 4,  note: 'E' as ChromaticNote, octaveAdj: 0, grade: 'III', role: 'stable' as const },
  { pos: 5,  note: 'F' as ChromaticNote, octaveAdj: 0, grade: 'IV',  role: 'tense'  as const },
  { pos: 7,  note: 'G' as ChromaticNote, octaveAdj: 0, grade: 'V',   role: 'stable' as const },
  { pos: 9,  note: 'A' as ChromaticNote, octaveAdj: 0, grade: 'VI',  role: 'tense'  as const },
  { pos: 11, note: 'B' as ChromaticNote, octaveAdj: 0, grade: 'VII', role: 'tense'  as const },
  { pos: 12, note: 'C' as ChromaticNote, octaveAdj: 1, grade: 'T',   role: 'tonic'  as const },
] as const;

// Las flechas de resolución del método. `width` codifica la jerarquía de
// tensión (1 s.t. > 2 s.t. ; sensible tonal > resto). Sólo neutros — la
// cuarentena prohíbe colorear las flechas con note hues.
const ARROWS = [
  { id: 'd-c',   fromIdx: 1, toIdx: 0, width: 2,   tier: 'long' },
  { id: 'd-e',   fromIdx: 1, toIdx: 2, width: 2,   tier: 'long' },
  { id: 'f-e',   fromIdx: 3, toIdx: 2, width: 2.5, tier: 'short' },
  { id: 'f-g',   fromIdx: 3, toIdx: 4, width: 1.5, tier: 'long' },
  { id: 'a-g',   fromIdx: 5, toIdx: 4, width: 2,   tier: 'long' },
  { id: 'b-c8',  fromIdx: 6, toIdx: 7, width: 3,   tier: 'short' },
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
const ARC_PEAK_LONG = 28;   // higher arc for 2-step jumps
const ARC_PEAK_SHORT = 78;  // lower arc for 1-step jumps (and the importants)
const ARPEGGIO_GAP_MS = 260;
const NOTE_DURATION = 1.4;
const FIRE_DEBOUNCE_MS = 150;

function nodeX(pos: number): number {
  return PAD_X + pos * STEP_X;
}

function arrowPath(originX: number, destX: number, peakY: number): string {
  // Cubic Bezier with vertical tangents at both endpoints — la flecha entra
  // perpendicular al nodo, así el marker apunta limpiamente hacia abajo.
  const startY = ARC_BASELINE;
  return `M ${originX} ${startY} C ${originX} ${peakY} ${destX} ${peakY} ${destX} ${startY}`;
}

export default function TensionResolucion() {
  const { playNote } = useAudioEngine();
  const lastFireRef = useRef<number>(0);

  const playSequence = useCallback(
    (fromIdx: number, toIdx: number) => {
      const now = performance.now();
      if (now - lastFireRef.current < FIRE_DEBOUNCE_MS) return;
      lastFireRef.current = now;

      const from = NODES[fromIdx];
      const to = NODES[toIdx];
      playNote(from.note, 4 + from.octaveAdj, NOTE_DURATION);
      setTimeout(
        () => playNote(to.note, 4 + to.octaveAdj, NOTE_DURATION),
        ARPEGGIO_GAP_MS,
      );
    },
    [playNote],
  );

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        role="img"
        aria-label="Mapa de resoluciones de tensión en C mayor"
      >
        <defs>
          <marker
            id="tension-arrowhead"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="5"
            orient="auto-start-reverse"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L6,0 L3,5 Z" className={styles.arrowHead} />
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
          const from = NODES[a.fromIdx];
          const to = NODES[a.toIdx];
          const peakY = a.tier === 'short' ? ARC_PEAK_SHORT : ARC_PEAK_LONG;
          return (
            <ArrowPath
              key={a.id}
              d={arrowPath(nodeX(from.pos), nodeX(to.pos), peakY)}
              width={a.width}
              ariaLabel={`Reproducir resolución de ${NOTE_ES[from.note]} a ${NOTE_ES[to.note]}`}
              onPlay={() => playSequence(a.fromIdx, a.toIdx)}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((n, i) => (
          <ScaleNode key={`${n.pos}-${i}`} data={n} />
        ))}
      </svg>

      <ul className={styles.legend} aria-label="Convenciones del mapa">
        <li>
          <span className={`${styles.swatch} ${styles.swatchStrong}`} />
          1 s.t. de tensión
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchStandard}`} />
          2 s.t. de tensión
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchLight}`} />
          alternativa más débil
        </li>
        <li>
          <span className={`${styles.swatch} ${styles.swatchPrimary}`} />
          sensible tonal (7mo → T)
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
}

function ArrowPath({ d, width, ariaLabel, onPlay }: ArrowPathProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent<SVGPathElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPlay();
      }
    },
    [onPlay],
  );

  return (
    <path
      d={d}
      className={styles.arrow}
      strokeWidth={width}
      markerEnd="url(#tension-arrowhead)"
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      onClick={onPlay}
      onFocus={onPlay}
      onKeyDown={handleKey}
    />
  );
}

interface ScaleNodeProps {
  data: typeof NODES[number];
}

function ScaleNode({ data }: ScaleNodeProps) {
  const { pos, note, role } = data;
  const cx = nodeX(pos);
  const radius =
    role === 'tonic' ? RADIUS_TONIC :
    role === 'tense' ? RADIUS_TENSE :
    RADIUS_STABLE;
  const opacity = role === 'tense' ? 0.55 : 1;
  const isLargeLetter = role === 'tonic';

  return (
    <g className={styles.node} aria-hidden="true">
      <circle
        cx={cx}
        cy={NODE_Y}
        r={radius}
        fill={NOTE_COLORS[note]}
        opacity={opacity}
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
