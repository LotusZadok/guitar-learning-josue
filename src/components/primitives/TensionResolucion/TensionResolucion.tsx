import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { ALL, NOTE_ES } from '../../../data/notes';
import { majorScaleSpelled, spelledNameES, tonicChromatic } from '../../../utils/noteCalculations';

const NOTE_DE_LETTER: Record<string, string> = {
  C: 'C', 'C#': 'Cis', D: 'D', 'D#': 'Dis', E: 'E', F: 'F',
  'F#': 'Fis', G: 'G', 'G#': 'Gis', A: 'A', 'A#': 'B', B: 'H',
};
import type { ChromaticNote, Tonic } from '../../../types/music';
import styles from './TensionResolucion.module.css';

// Reunión 24/5/26: la ortografía respeta la escala mayor (B♭ en F mayor, no A#).
// El audio sigue usando ChromaticNote; el display usa la versión spelled.

interface TensionNode {
  pos: number;
  note: ChromaticNote;       // para audio
  spelled: string;           // para display (con ♯/♭ correcto según escala mayor)
  octaveAdj: number;
  grade: string;
  role: 'tonic' | 'stable' | 'intermediate' | 'tense';
}

const SCALE_POS   = [0, 2, 4, 5, 7, 9, 11, 12] as const;
const GRADE_NAMES = ['T', '2', '3', '4', '5', '6', '7', 'T'] as const;
const NODE_ROLES: TensionNode['role'][] = [
  'tonic', 'intermediate', 'stable', 'tense', 'stable', 'intermediate', 'tense', 'tonic',
];

function buildNodes(tonic: Tonic): TensionNode[] {
  const tonicIdx = ALL.indexOf(tonicChromatic(tonic));
  const spelledScale = majorScaleSpelled(tonic); // 7 grados con ortografía correcta
  return SCALE_POS.map((pos, i) => ({
    pos,
    note: ALL[(tonicIdx + pos) % 12],
    spelled: spelledScale[i % 7],
    // Reunión 9/6/26 (piso-tónica): la octava sube donde la escala envuelve el
    // índice cromático, no solo en la 8va de cierre. Con `pos === 12 ? 1 : 0`
    // toda tonalidad que cruza C (es decir, todas menos Do) tocaba grados por
    // DEBAJO de la tónica (en Sol mayor, C4 bajo G4).
    octaveAdj: Math.floor((tonicIdx + pos) / 12),
    grade: GRADE_NAMES[i],
    role: NODE_ROLES[i],
  }));
}

// Flechas de resolución. Tras la reunión 24/5/26 las del 4to grado también son arcos
// (antes eran rectas y aparentaban una línea continua III—V que cruzaba el IV).
// 'curve' = arco amplio; 'shortCurve' = arco corto (1 s.t. de distancia).
const ARROWS = [
  { id: 'd-c',  fromIdx: 1, toIdx: 0, width: 1.5, kind: 'curve'      },
  { id: 'd-e',  fromIdx: 1, toIdx: 2, width: 1.5, kind: 'curve'      },
  { id: 'f-e',  fromIdx: 3, toIdx: 2, width: 1.5, kind: 'shortCurve' },
  { id: 'f-g',  fromIdx: 3, toIdx: 4, width: 1.5, kind: 'shortCurve' },
  { id: 'a-g',  fromIdx: 5, toIdx: 4, width: 1.5, kind: 'curve'      },
  { id: 'b-c8', fromIdx: 6, toIdx: 7, width: 1.5, kind: 'shortCurve' },
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
// Reunión 6/7/26: separar/alargar las 2 notas de cada flecha para que la
// resolución se oiga clara (antes 260ms se encimaban demasiado).
const ARPEGGIO_GAP_MS = 430;
const NOTE_TAIL_MS = 420;
const FIRE_DEBOUNCE_MS = 150;

function nodeX(pos: number): number {
  return PAD_X + pos * STEP_X;
}

function arrowPath(originX: number, destX: number, kind: 'shortCurve' | 'curve'): string {
  const startY = ARC_BASELINE;
  const midX = (originX + destX) / 2;
  // 'shortCurve' = arco menor para resoluciones de 1 s.t. — sigue saliendo visiblemente
  // del nodo origen (no como recta que cruza nodos intermedios).
  const rise = kind === 'shortCurve' ? ARC_RISE * 0.4 : ARC_RISE;
  const peakY = startY - rise;
  return `M ${originX} ${startY} Q ${midX} ${peakY} ${destX} ${startY}`;
}

export default function TensionResolucion() {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const tonic = useUIStore((s) => s.tonic);
  const nodes = useMemo(() => buildNodes(tonic), [tonic]);
  const { playSequence } = useAudioEngine();
  const lastFireRef = useRef<number>(0);
  const [playingArrow, setPlayingArrow] = useState<string | null>(null);

  const playResolution = useCallback(
    (fromIdx: number, toIdx: number, arrowId: string) => {
      const now = performance.now();
      if (now - lastFireRef.current < FIRE_DEBOUNCE_MS) return;
      lastFireRef.current = now;

      setPlayingArrow(arrowId);
      const from = nodes[fromIdx];
      const to = nodes[toIdx];
      // Dirección melódica de la resolución (tensa → estable), no se reordena.
      playSequence(
        [
          { name: from.note, octave: 4 + from.octaveAdj },
          { name: to.note, octave: 4 + to.octaveAdj },
        ],
        ARPEGGIO_GAP_MS,
        NOTE_TAIL_MS,
      );
      setTimeout(() => setPlayingArrow(null), ARPEGGIO_GAP_MS + NOTE_TAIL_MS + 400);
    },
    [playSequence, nodes],
  );

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        role="img"
        aria-label={isDe
          ? `Karte der Spannungsauflösungen in ${NOTE_DE_LETTER[tonicChromatic(tonic)] ?? tonic}-Dur`
          : `Mapa de resoluciones de tensión en ${spelledNameES(tonic)} mayor`}
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
              ariaLabel={isDe
                ? `Auflösung von ${NOTE_DE_LETTER[from.note] ?? from.note} nach ${NOTE_DE_LETTER[to.note] ?? to.note} spielen`
                : `Reproducir resolución de ${NOTE_ES[from.note]} a ${NOTE_ES[to.note]}`}
              onPlay={() => playResolution(a.fromIdx, a.toIdx, a.id)}
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

      {/* Reunión 24/5/26: removidas las entradas "4ª/7ª tensos" y "2ª/6ª intermedios"
          del legend (la información ya está implícita en el strip y se duplica). */}
      <ul className={styles.legend} aria-label={isDe ? 'Kartenkonventionen' : 'Convenciones del mapa'}>
        <li>
          <span className={styles.swatchStable} />
          {isDe ? 'Stabil' : 'Estable'}
        </li>
        <li>
          <span className={styles.swatchIntermediate} />
          {isDe ? 'Mittel' : 'Intermedia'}
        </li>
        <li>
          <span className={styles.swatchTense} />
          {isDe ? 'Spannend' : 'Tensa'}
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
  const { pos, spelled, role } = data;
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
        {spelled}
      </text>
      <text x={cx} y={NODE_Y + radius + 22} className={styles.gradeLabel}>
        {data.grade}
      </text>
    </g>
  );
}
