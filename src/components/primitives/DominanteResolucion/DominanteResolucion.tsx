import { useCallback, useMemo, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useChordPlayer } from '../../../hooks/useChordPlayer';
import PlaybackButton, { type PlayMode } from '../../shared/PlaybackButton/PlaybackButton';
import { useFireGate } from '../../../hooks/useFireGate';
import { useUIStore } from '../../../stores/useUIStore';
import { NOTE_COLORS, ALL } from '../../../data/notes';
import {
  intervalLabel,
  formatChordSymbol,
  formatNote,
  acordeDominante,
  majorScaleSpelled,
  pitchClass,
  tonicChromatic,
  type OrigenDominante,
  nombreNota,
} from '../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../types/music';
import styles from './DominanteResolucion.module.css';

const NOTE_DURATION = 1.4;
const CHORD_GAP_MS = 900;
const ARPEGGIO_GAP_MS = 150;

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

const ORIGENES: OrigenDominante[] = ['V7', 'vii'];

// Resoluciones por semitono: grado de origen → posición de destino en el eje.
const RESOLUCIONES = [
  { fromDeg: 6, toSemis: 12 }, // sensible sube a la tónica (8va)
  { fromDeg: 3, toSemis: 4 }, // 4º grado baja a la 3ª
];

const DEG_SEMIS = [0, 2, 4, 5, 7, 9, 11];
const I_DEGREES = [0, 2, 4];

const R = 19;
const SVG_W = 560;
const SVG_H = 250;
const PAD_X = 34;
// Margen a la izquierda del eje para el cifrado de cada fila: "Em7♭5" mide
// ~40px y antes quedaba recortado (reunión 19/10/26: se leía solo "7♭5").
const LABEL_GUTTER = 48;
const LABEL_X = PAD_X - R - 8;
const STEP_X = (SVG_W - 2 * PAD_X) / 12;
const AXIS_Y = 125;
const ROW_OFFSET = 62; // distancia de cada fila al eje

const posX = (semis: number) => PAD_X + semis * STEP_X;
const key = (v: { semis: number }, row: string) => `${row}-${v.semis}`;

interface Voice {
  spelled: string;
  chromatic: ChromaticNote;
  octave: number;
  deg: number;
  semis: number;
  x: number;
  y: number;
  tritono?: boolean;
  /** Solo en la fila del acorde de origen: T, 3M, 5J, 7m… (reunión 19/10/26:
   *  "la gente podría pensar que sol es la tónica"). */
  intervalo?: string;
}

interface Props {
  /** El acorde elegido vive en la sección: el texto de §3.6.2 cambia con él. */
  origen: OrigenDominante;
  onOrigenChange: (origen: OrigenDominante) => void;
  /** Textos accesibles; vienen de la sección (i18n). */
  labels: {
    selector: string;
    diagram: (origen: string, destino: string) => string;
  };
}

export default function DominanteResolucion({ origen, onOrigenChange, labels }: Props) {
  const lang = useTranslation().i18n.language;
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();
  const { playChord, at, clear } = useChordPlayer(NOTE_DURATION);
  const [hovered, setHovered] = useState<string | null>(null);
  const [playing, setPlaying] = useState<PlayMode | null>(null);
  const [sonando, setSonando] = useState<string[]>([]);
  const fire = useFireGate();

  const { origenVoices, iRow, origenLabel, iLabel } = useMemo(() => {
    const scale = majorScaleSpelled(tonic);
    const acorde = acordeDominante(tonic, origen);
    const tonicIdx = ALL.indexOf(tonicChromatic(tonic));
    // Ley del piso: la tónica es la nota más grave y la octava sube donde el
    // grado envuelve el índice cromático.
    const voice = (
      deg: number,
      up: boolean,
      semisOverride?: number,
      tritono = false,
      intervalo?: string,
    ): Voice => {
      const semis = semisOverride ?? DEG_SEMIS[deg];
      return {
        spelled: scale[deg],
        chromatic: ALL[pitchClass(scale[deg])],
        octave: 4 + Math.floor((tonicIdx + semis) / 12),
        deg,
        semis,
        x: posX(semis),
        y: AXIS_Y + (up ? -ROW_OFFSET : ROW_OFFSET),
        tritono,
        intervalo,
      };
    };
    return {
      origenVoices: acorde.voces.map((v) => voice(v.grado, true, undefined, v.tritono, v.intervalo)),
      // El I lleva su octava además de la tónica: es donde aterriza la sensible.
      iRow: [...I_DEGREES.map((d) => voice(d, false)), voice(0, false, 12)],
      origenLabel: formatChordSymbol(acorde.cifrado, lang),
      iLabel: formatNote(scale[0], lang),
    };
  }, [tonic, origen, lang]);

  const scrub = useCallback(
    (v: Voice) => {
      if (!fire()) return;
      playNote(v.chromatic, v.octave, { duracion: NOTE_DURATION });
    },
    [playNote, fire],
  );

  // Reunión 19/10/26: los mismos dos botones de los ejemplos de acordes
  // (bloque y arpegio), con la nota que suena resaltada en ámbar.
  const playResolution = useCallback(
    (mode: PlayMode) => {
      if (playing) return;
      clear();
      setPlaying(mode);
      const gap = mode === 'arpegio' ? ARPEGGIO_GAP_MS : 0;
      const filas = [
        { voces: origenVoices, fila: 'o' },
        { voces: iRow, fila: 'i' },
      ];
      let inicio = 0;
      filas.forEach(({ voces, fila }) => {
        playChord(voces, gap, inicio);
        if (gap === 0) at(() => setSonando(voces.map((v) => key(v, fila))), inicio);
        else voces.forEach((v, i) => at(() => setSonando([key(v, fila)]), inicio + i * gap));
        inicio += voces.length * gap + CHORD_GAP_MS;
      });
      at(() => {
        setPlaying(null);
        setSonando([]);
      }, inicio + NOTE_DURATION * 500);
    },
    [origenVoices, iRow, playing, clear, at, playChord],
  );

  const arrows = RESOLUCIONES.map(({ fromDeg, toSemis }) => ({
    from: origenVoices.find((v) => v.deg === fromDeg)!,
    to: iRow.find((v) => v.semis === toSemis)!,
  }));

  return (
    <div className={styles.wrap}>
      <div className={styles.selector} role="group" aria-label={labels.selector}>
        {ORIGENES.map((k) => (
          <button
            key={k}
            type="button"
            className={k === origen ? styles.chipActive : styles.chip}
            aria-pressed={k === origen}
            onClick={() => onOrigenChange(k)}
            disabled={playing !== null}
          >
            {acordeDominante(tonic, k).roman} → I
          </button>
        ))}
      </div>

      <svg
        className={styles.diagram}
        viewBox={`${-LABEL_GUTTER} 0 ${SVG_W + LABEL_GUTTER} ${SVG_H}`}
        role="group"
        aria-label={labels.diagram(origenLabel, iLabel)}
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

        <text className={styles.rowLabel} x={LABEL_X} y={AXIS_Y - ROW_OFFSET}>
          {origenLabel}
        </text>
        <text className={styles.rowLabel} x={LABEL_X} y={AXIS_Y + ROW_OFFSET}>
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
              sounding={sonando.includes(key(v, row))}
              onEnter={() => {
                setHovered(key(v, row));
                scrub(v);
              }}
              onLeave={() => setHovered((h) => (h === key(v, row) ? null : h))}
            />
          ),
        )}
      </svg>

      <div className={styles.play}>
        <span className={styles.playLabel}>
          {origenLabel} → {iLabel}
        </span>
        {(['bloque', 'arpegio'] as const).map((mode) => (
          <PlaybackButton
            key={mode}
            mode={mode}
            playing={playing === mode}
            disabled={playing !== null && playing !== mode}
            onClick={() => playResolution(mode)}
          />
        ))}
      </div>
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
  sounding: boolean;
  onEnter: () => void;
  onLeave: () => void;
}

function VoiceNode({ voice, colored, sounding, onEnter, onLeave }: VoiceNodeProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const onKey = useCallback(
    (e: KeyboardEvent<SVGGElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onEnter();
      }
    },
    [onEnter],
  );
  const name = nombreNota(voice.spelled, lang);

  return (
    <g
      className={styles.node}
      transform={`translate(${voice.x},${voice.y})`}
      role="button"
      tabIndex={0}
      aria-label={`${name}${voice.tritono ? ` · ${t('common.tritone')}` : ''}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onKeyDown={onKey}
    >
      <circle className={styles.hit} cx={0} cy={0} r={R + 6} fill="transparent" />
      {/* Ámbar = "sonando ahora" (Amber-Means-Sounding): solo mientras suena. */}
      {sounding && (
        <circle cx={0} cy={0} r={R + 9} fill="none" stroke="var(--amber)" strokeWidth={2.5} />
      )}
      {voice.intervalo && (
        <text className={styles.intervalo} x={0} y={-R - 18}>
          {intervalLabel(voice.intervalo, lang)}
        </text>
      )}
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
        {formatNote(voice.spelled, lang)}
      </text>
    </g>
  );
}
