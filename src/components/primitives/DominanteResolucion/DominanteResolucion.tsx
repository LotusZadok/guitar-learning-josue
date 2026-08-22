import { useCallback, useMemo, useState, type KeyboardEvent } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useFireGate } from '../../../hooks/useFireGate';
import { useUIStore } from '../../../stores/useUIStore';
import { NOTE_COLORS, ALL, spelledToES } from '../../../data/notes';
import { majorScaleSpelled, pitchClass, tonicChromatic } from '../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../types/music';
import styles from './DominanteResolucion.module.css';

const NOTE_DURATION = 1.4;
const CHORD_GAP_MS = 900;

// Diagrama de resolución hacia el I sobre el MISMO eje cromático horizontal de
// §1.4 y §1.5 (0–12 semitonos desde la tónica). Dos acordes de la tonalidad
// llevan el mismo tritono y por eso empujan igual hacia la tónica (§3.5): el V7
// (dominante sobre el 5º grado, tritono entre su 3ª=sensible y su 7ª) y el vii
// (m7♭5 sobre la sensible, tritono entre su raíz y su 5ª disminuida). En ambos
// son LAS MISMAS dos notas.
//
// Sobre el eje van las notas del acorde de origen; bajo el eje, las del I. Los
// arcos salen de las dos notas del tritono: la sensible sube un semitono a la
// tónica (la 8va, posición 12) y el 4º grado baja un semitono a la 3ª. Sobre
// este eje el movimiento contrario se ve literalmente: uno va hacia la derecha
// y el otro hacia la izquierda.

type Origen = 'V7' | 'vii';

// degrees: grados de la escala mayor (0-index) que forman el acorde.
// El tritono siempre son los mismos dos grados: la sensible (6) y el 4º (3).
const ORIGENES: Record<Origen, { roman: string; suffix: string; rootDeg: number; degrees: number[] }> = {
  V7: { roman: 'V7', suffix: '7', rootDeg: 4, degrees: [4, 6, 1, 3] },
  vii: { roman: 'vii', suffix: 'm7♭5', rootDeg: 6, degrees: [6, 1, 3, 5] },
};

const TRITONO_DEGS = [6, 3];
// Resoluciones por semitono: grado de origen → posición de destino en el eje.
const RESOLUCIONES = [
  { fromDeg: 6, toSemis: 12 }, // sensible sube a la tónica (8va)
  { fromDeg: 3, toSemis: 4 }, // 4º grado baja a la 3ª
];

const DEG_SEMIS = [0, 2, 4, 5, 7, 9, 11];
const I_DEGREES = [0, 2, 4];

const SVG_W = 560;
const SVG_H = 250;
const PAD_X = 34;
const STEP_X = (SVG_W - 2 * PAD_X) / 12;
const AXIS_Y = 125;
const ROW_OFFSET = 62; // distancia de cada fila al eje
const R = 19;

const posX = (semis: number) => PAD_X + semis * STEP_X;

interface Voice {
  spelled: string;
  chromatic: ChromaticNote;
  octave: number;
  deg: number;
  semis: number;
  x: number;
  y: number;
  tritono?: boolean;
}

export default function DominanteResolucion() {
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();
  const [origen, setOrigen] = useState<Origen>('V7');
  const [hovered, setHovered] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const fire = useFireGate();

  const { origenVoices, iRow, origenLabel, iLabel } = useMemo(() => {
    const scale = majorScaleSpelled(tonic);
    const def = ORIGENES[origen];
    const tonicIdx = ALL.indexOf(tonicChromatic(tonic));
    // Ley del piso: la tónica es la nota más grave y la octava sube donde el
    // grado envuelve el índice cromático.
    const voice = (deg: number, up: boolean, semisOverride?: number): Voice => {
      const semis = semisOverride ?? DEG_SEMIS[deg];
      return {
        spelled: scale[deg],
        chromatic: ALL[pitchClass(scale[deg])],
        octave: 4 + Math.floor((tonicIdx + semis) / 12),
        deg,
        semis,
        x: posX(semis),
        y: AXIS_Y + (up ? -ROW_OFFSET : ROW_OFFSET),
        tritono: up && TRITONO_DEGS.includes(deg),
      };
    };
    return {
      origenVoices: def.degrees.map((d) => voice(d, true)),
      // El I lleva su octava además de la tónica: es donde aterriza la sensible.
      iRow: [...I_DEGREES.map((d) => voice(d, false)), voice(0, false, 12)],
      origenLabel: scale[def.rootDeg] + def.suffix,
      iLabel: scale[0],
    };
  }, [tonic, origen]);

  const scrub = useCallback(
    (v: Voice) => {
      if (!fire()) return;
      playNote(v.chromatic, v.octave, NOTE_DURATION);
    },
    [playNote, fire],
  );

  const playResolution = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    origenVoices.forEach((v) => playNote(v.chromatic, v.octave, NOTE_DURATION));
    setTimeout(() => iRow.forEach((v) => playNote(v.chromatic, v.octave, NOTE_DURATION)), CHORD_GAP_MS);
    setTimeout(() => setPlaying(false), CHORD_GAP_MS + NOTE_DURATION * 1000);
  }, [origenVoices, iRow, playNote, playing]);

  const arrows = RESOLUCIONES.map(({ fromDeg, toSemis }) => ({
    from: origenVoices.find((v) => v.deg === fromDeg)!,
    to: iRow.find((v) => v.semis === toSemis)!,
  }));

  const key = (v: Voice, row: string) => `${row}-${v.semis}`;

  return (
    <div className={styles.wrap}>
      <div className={styles.selector} role="group" aria-label="Acorde de origen">
        {(Object.keys(ORIGENES) as Origen[]).map((k) => (
          <button
            key={k}
            type="button"
            className={k === origen ? styles.chipActive : styles.chip}
            aria-pressed={k === origen}
            onClick={() => setOrigen(k)}
            disabled={playing}
          >
            {ORIGENES[k].roman} → I
          </button>
        ))}
      </div>

      <svg
        className={styles.diagram}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        role="group"
        aria-label={`Resolución de ${origenLabel} a ${iLabel} sobre el eje cromático: la sensible sube a la tónica y el 4º grado baja a la tercera`}
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
            <path d="M0,0 L6,3 L0,6 z" className={styles.arrowHead} />
          </marker>
        </defs>

        {/* Eje cromático: los 13 semitonos desde la tónica, como en §1.4. */}
        <line className={styles.axis} x1={PAD_X} y1={AXIS_Y} x2={SVG_W - PAD_X} y2={AXIS_Y} />
        {Array.from({ length: 13 }, (_, s) => (
          <circle key={s} className={styles.tick} cx={posX(s)} cy={AXIS_Y} r={2.5} />
        ))}

        <text className={styles.rowLabel} x={PAD_X - 12} y={AXIS_Y - ROW_OFFSET}>
          {origenLabel}
        </text>
        <text className={styles.rowLabel} x={PAD_X - 12} y={AXIS_Y + ROW_OFFSET}>
          {iLabel}
        </text>

        {arrows.map((a, i) => (
          <ResolutionArrow key={i} from={a.from} to={a.to} />
        ))}

        {[...origenVoices.map((v) => [v, 'o'] as const), ...iRow.map((v) => [v, 'i'] as const)].map(
          ([v, row]) => (
            <VoiceNode
              key={key(v, row)}
              voice={v}
              colored={hovered === key(v, row)}
              onEnter={() => {
                setHovered(key(v, row));
                scrub(v);
              }}
              onLeave={() => setHovered((h) => (h === key(v, row) ? null : h))}
            />
          ),
        )}
      </svg>

      <button type="button" className={styles.playBtn} onClick={playResolution} disabled={playing}>
        {origenLabel} → {iLabel}
      </button>
    </div>
  );
}

// Arco entre las dos filas: sale del borde del nodo de arriba y entra por el
// borde del de abajo. La curva es vertical en sus extremos para que se lea de
// qué nodo sale y a cuál llega aunque las x sean casi iguales.
function ResolutionArrow({ from, to }: { from: Voice; to: Voice }) {
  const y1 = from.y + R;
  const y2 = to.y - R;
  const midY = (y1 + y2) / 2;
  return (
    <path
      className={styles.arrow}
      d={`M ${from.x} ${y1} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${y2}`}
      markerEnd="url(#dom-arrow)"
      fill="none"
    />
  );
}

interface VoiceNodeProps {
  voice: Voice;
  colored: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

function VoiceNode({ voice, colored, onEnter, onLeave }: VoiceNodeProps) {
  const onKey = useCallback(
    (e: KeyboardEvent<SVGGElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onEnter();
      }
    },
    [onEnter],
  );
  const nameES = spelledToES(voice.spelled);

  return (
    <g
      className={styles.node}
      transform={`translate(${voice.x},${voice.y})`}
      role="button"
      tabIndex={0}
      aria-label={`${nameES}${voice.tritono ? ' · tritono' : ''}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onKeyDown={onKey}
    >
      <circle className={styles.hit} cx={0} cy={0} r={R + 6} fill="transparent" />
      {/* Tritono: anillo punteado en neutro de marca. El punteado dice
       *  "inestable, quiere moverse"; el ámbar quedó reservado para "sonando". */}
      {voice.tritono && (
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
      <circle
        cx={0}
        cy={0}
        r={R}
        fill={colored ? NOTE_COLORS[voice.chromatic] : 'var(--surface)'}
        stroke={colored ? 'none' : 'var(--rule)'}
        strokeWidth={1.5}
      />
      {/* Glifo de nota blanco sobre círculo saturado en hover: excepción Signature. */}
      <text
        className={styles.glyph}
        x={0}
        y={1}
        fill={colored ? '#fff' : 'var(--text-body)'}
        style={voice.spelled.length > 2 ? { fontSize: '13px' } : undefined}
      >
        {voice.spelled}
      </text>
    </g>
  );
}
