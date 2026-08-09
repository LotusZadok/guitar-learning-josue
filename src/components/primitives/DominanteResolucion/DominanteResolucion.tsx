import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { NOTE_COLORS, ALL, spelledToES } from '../../../data/notes';
import { majorScaleSpelled, pitchClass, spelledSequenceAscending } from '../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../types/music';
import styles from './DominanteResolucion.module.css';

const NOTE_DURATION = 1.4;
const CHORD_GAP_MS = 900;
const FIRE_DEBOUNCE_MS = 150;
const R = 20;

// Diagrama de resolución V7 → I. El V7 (dominante sobre el 5º grado) contiene un
// tritono entre su 3ª (sensible) y su 7ª; esas dos notas resuelven por semitono:
// la sensible sube a la tónica, la 7ª baja a la 3ª. Todo diatónico (deriva de la
// escala mayor de la tónica activa).

interface Node {
  spelled: string;
  chromatic: ChromaticNote;
  octave: number;
  x: number;
  y: number;
  tritono?: boolean;
}

const V7_X = 120;
const I_X = 350;
const VB_W = 470;
const VB_H = 270;

export default function DominanteResolucion() {
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();
  const [hovered, setHovered] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const lastFire = useRef(0);

  const { v7, chordI, v7Label, iLabel } = useMemo(() => {
    const scale = majorScaleSpelled(tonic); // 7 notas
    // V7 = grados 5·7·2·4 (raíz, 3ª=sensible, 5ª, 7ª). I = grados 1·3·5.
    const v7Spelled = [scale[4], scale[6], scale[1], scale[3]];
    const iSpelled = [scale[0], scale[2], scale[4]];
    const v7Oct = spelledSequenceAscending(v7Spelled, 4).map((s) => s.octave);
    const iOct = spelledSequenceAscending(iSpelled, 4).map((s) => s.octave);
    // El V7 se apila con la raíz abajo; el tritono (B abajo-medio, F arriba)
    // queda separado. El acorde I se coloca compacto en el centro para que las
    // flechas del tritono CONVERJAN hacia él (la sensible SUBE a la tónica, la
    // 7ª BAJA a la 3ª): dirección visual = dirección musical (movimiento contrario).
    const v7Y = [215, 155, 95, 35];
    const iY = [140, 95, 50];
    const v7: Node[] = v7Spelled.map((sp, i) => ({
      spelled: sp,
      chromatic: ALL_FROM(sp),
      octave: v7Oct[i],
      x: V7_X,
      y: v7Y[i],
      tritono: i === 1 || i === 3, // 3ª (sensible) y 7ª
    }));
    const chordI: Node[] = iSpelled.map((sp, i) => ({
      spelled: sp,
      chromatic: ALL_FROM(sp),
      octave: iOct[i],
      x: I_X,
      y: iY[i],
    }));
    return {
      v7,
      chordI,
      v7Label: scale[4] + '7',
      iLabel: scale[0],
    };
  }, [tonic]);

  const scrub = useCallback(
    (n: Node) => {
      const now = Date.now();
      if (now - lastFire.current < FIRE_DEBOUNCE_MS) return;
      lastFire.current = now;
      playNote(n.chromatic, n.octave, NOTE_DURATION);
    },
    [playNote],
  );

  // Play resolución: V7 en bloque, luego I en bloque.
  const playResolution = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    v7.forEach((n) => playNote(n.chromatic, n.octave, NOTE_DURATION));
    setTimeout(() => chordI.forEach((n) => playNote(n.chromatic, n.octave, NOTE_DURATION)), CHORD_GAP_MS);
    setTimeout(() => setPlaying(false), CHORD_GAP_MS + NOTE_DURATION * 1000);
  }, [v7, chordI, playNote, playing]);

  // Flechas de resolución: sensible (V7[1]) → tónica (I[0]); 7ª (V7[3]) → 3ª (I[1]).
  const arrows = [
    { from: v7[1], to: chordI[0] },
    { from: v7[3], to: chordI[1] },
  ];

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.diagram}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="group"
        aria-label={`Resolución de ${v7Label} a ${iLabel}: la sensible sube a la tónica y la séptima baja a la tercera`}
      >
        <defs>
          <marker
            id="dom-arrow"
            markerWidth="7"
            markerHeight="7"
            refX="5.5"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L6,3 L0,6 z" fill="var(--amber)" />
          </marker>
        </defs>

        {/* etiquetas de cifrado */}
        <text className={styles.cifrado} x={V7_X} y={18}>{v7Label}</text>
        <text className={styles.roman} x={V7_X} y={252}>V7</text>
        <text className={styles.cifrado} x={I_X} y={18}>{iLabel}</text>
        <text className={styles.roman} x={I_X} y={252}>I</text>

        {/* flechas de resolución */}
        {arrows.map((a, i) => (
          <ResolutionArrow key={i} x1={a.from.x + R} y1={a.from.y} x2={a.to.x - R} y2={a.to.y} />
        ))}

        {[...v7, ...chordI].map((n) => (
          <NoteNode
            key={`${n.x}-${n.spelled}-${n.octave}`}
            node={n}
            colored={hovered === `${n.x}-${n.spelled}`}
            onEnter={() => {
              setHovered(`${n.x}-${n.spelled}`);
              scrub(n);
            }}
            onLeave={() => setHovered((h) => (h === `${n.x}-${n.spelled}` ? null : h))}
          />
        ))}
      </svg>

      <button
        type="button"
        className={styles.playBtn}
        onClick={playResolution}
        disabled={playing}
      >
        {v7Label} → {iLabel}
      </button>
    </div>
  );
}

// Convierte una grafía a su ChromaticNote (enarmoniza a sostenido, como el motor).
function ALL_FROM(spelled: string): ChromaticNote {
  return ALL[pitchClass(spelled)];
}

interface NoteNodeProps {
  node: Node;
  colored: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

function NoteNode({ node, colored, onEnter, onLeave }: NoteNodeProps) {
  const onKey = useCallback(
    (e: KeyboardEvent<SVGGElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onEnter();
      }
    },
    [onEnter],
  );
  const fill = colored ? NOTE_COLORS[node.chromatic] : 'var(--surface)';
  const stroke = colored ? 'none' : 'var(--rule)';
  const nameES = spelledToES(node.spelled);

  return (
    <g
      className={styles.node}
      transform={`translate(${node.x},${node.y})`}
      role="button"
      tabIndex={0}
      aria-label={`${nameES}${node.tritono ? ' · tritono' : ''}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onKeyDown={onKey}
    >
      <circle className={styles.hit} cx={0} cy={0} r={R + 6} fill="transparent" />
      {/* Tritono: anillo punteado en neutro de marca. El punteado dice
       *  "inestable, quiere moverse"; el ámbar quedó reservado para "sonando". */}
      {node.tritono && (
        <circle
          cx={0}
          cy={0}
          r={R + 5}
          fill="none"
          stroke="var(--paper)"
          strokeWidth={1.5}
          strokeDasharray="3 3"
        />
      )}
      <circle cx={0} cy={0} r={R} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {/* Glifo de nota blanco sobre círculo saturado en hover: excepción Signature. */}
      <text
        className={styles.glyph}
        x={0}
        y={1}
        fill={colored ? '#fff' : 'var(--text-body)'}
        style={node.spelled.length > 2 ? { fontSize: '13px' } : undefined}
      >
        {node.spelled}
      </text>
    </g>
  );
}

function ResolutionArrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const mx = (x1 + x2) / 2;
  return (
    <path
      className={styles.arrow}
      d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
      markerEnd="url(#dom-arrow)"
    />
  );
}
