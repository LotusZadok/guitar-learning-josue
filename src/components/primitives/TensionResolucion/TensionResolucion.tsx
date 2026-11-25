import {
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { useAudioEngine } from "../../../hooks/useAudioEngine";
import { useChordPlayer } from "../../../hooks/useChordPlayer";
import PlaybackButton from "../../shared/PlaybackButton/PlaybackButton";
import { useFireGate } from "../../../hooks/useFireGate";
import { useUIStore } from "../../../stores/useUIStore";
import { ALL, NOTE_ES, NOTE_DE } from "../../../data/notes";
import {
  formatNote,
  majorScaleSpelled,
  spelledNameES,
  tonicChromatic,
} from "../../../utils/noteCalculations";

import { gananciaDeNotaEnEscala, type RolDeNotaEnEscala } from "../../../utils/progresionArmonica";
import type { ChromaticNote, Tonic } from "../../../types/music";
import styles from "./TensionResolucion.module.css";

// Reunión 24/5/26: la ortografía respeta la escala mayor (B♭ en F mayor, no A#).
// El audio sigue usando ChromaticNote; el display usa la versión spelled.

interface TensionNode {
  pos: number;
  note: ChromaticNote; // para audio
  spelled: string; // para display (con ♯/♭ correcto según escala mayor)
  octaveAdj: number;
  grade: string;
  role: RolDeNotaEnEscala;
}

// El color de cada nodo (verde, naranja, rojo) es el que fija su volumen.
const gananciaDe = (n: TensionNode) => gananciaDeNotaEnEscala(n.role);

const SCALE_POS = [0, 2, 4, 5, 7, 9, 11, 12] as const;
const GRADE_NAMES = ["T", "2", "3", "4", "5", "6", "7", "T"] as const;
const NODE_ROLES: TensionNode["role"][] = [
  "tonic",
  "intermediate",
  "stable",
  "tense",
  "stable",
  "intermediate",
  "tense",
  "tonic",
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

// Flechas de resolución (tensa o intermedia → reposo).
const ARROWS = [
  { id: "d-c", fromIdx: 1, toIdx: 0 },
  { id: "d-e", fromIdx: 1, toIdx: 2 },
  { id: "f-e", fromIdx: 3, toIdx: 2 },
  { id: "f-g", fromIdx: 3, toIdx: 4 },
  { id: "a-g", fromIdx: 5, toIdx: 4 },
  { id: "b-c8", fromIdx: 6, toIdx: 7 },
] as const;

const SVG_W = 560;
const PAD_X = 32;
const GRID_UNITS = 12;
const STEP_X = (SVG_W - 2 * PAD_X) / GRID_UNITS;
const NODE_Y = 72;
const RADIUS_TONIC = 22;
const RADIUS_STABLE = 18;
const RADIUS_TENSE = 18;
const ARROW_WIDTH = 1.75;
// Los números de grado van en una regla propia, por debajo de los arcos que
// bajan, para que ninguna flecha los cruce.
const AXIS_Y = NODE_Y + 80;
const GRADE_Y = NODE_Y + 92;
const SVG_H = GRADE_Y + 14;
// Vano del tritono (§3.5), por debajo de los números de grado: más arriba sus
// extremos tachaban el "4" y el "7" (reunión 19/10/26).
const TRITONO_Y = GRADE_Y + 26;
const SVG_H_TRITONO = TRITONO_Y + 32;
// Reunión 6/7/26: separar/alargar las 2 notas de cada flecha para que la
// resolución se oiga clara (antes 260ms se encimaban demasiado).
const ARPEGGIO_GAP_MS = 430;
const NOTE_TAIL_MS = 420;

function nodeX(pos: number): number {
  return PAD_X + pos * STEP_X;
}

function nodeRadius(role: RolDeNotaEnEscala): number {
  return role === "tonic" ? RADIUS_TONIC : role === "tense" ? RADIUS_TENSE : RADIUS_STABLE;
}

// Pedido de Sebastián (24/11/26): las flechas como señalización. La resolución
// que sube va por arriba y la que baja por abajo; así cada lado de cada nodo
// tiene a lo sumo una flecha y ninguna punta se encima con otra (antes D→E y
// F→E llegaban al mismo punto sobre E). Cada flecha sale y llega por el borde
// del nodo, del lado de la otra nota. Los vecinos a 1 s.t. casi se tocan: sus
// flechas salen casi por arriba y forman un arco alto y angosto.
interface ArrowGeometry {
  d: string;
  label: string;
  labelX: number;
  labelY: number;
}

function arrowGeometry(from: TensionNode, to: TensionNode): ArrowGeometry {
  const semitones = Math.abs(to.pos - from.pos);
  const up = to.pos > from.pos;
  const toRight = nodeX(to.pos) > nodeX(from.pos);
  const side = up ? -1 : 1;
  const angle = ((semitones === 1 ? 12 : 40) * Math.PI) / 180;
  const port = (n: TensionNode, towardRight: boolean): [number, number] => {
    const r = nodeRadius(n.role) + 3;
    return [nodeX(n.pos) + (towardRight ? 1 : -1) * r * Math.sin(angle), NODE_Y + side * r * Math.cos(angle)];
  };
  const [x1, y1] = port(from, toRight);
  const [x2, y2] = port(to, !toRight);
  const depth = semitones === 1 ? 44 : 50;
  const controlY = NODE_Y + side * depth;
  const lean = semitones === 1 ? 0 : toRight ? 6 : -6;
  return {
    d: `M ${x1} ${y1} C ${x1 + lean} ${controlY}, ${x2 - lean} ${controlY}, ${x2} ${y2}`,
    label: `${up ? "+" : "−"}${semitones}`,
    labelX: (x1 + x2) / 2,
    labelY: NODE_Y + side * (depth * 0.75 + 13),
  };
}

interface Props {
  /** T3 §3.6.1: el mismo mapa, leído como tritono. Deja sólo los arcos que salen
   *  de los dos grados tensos (4ª y 7ª — que ES el tritono de la tonalidad),
   *  dibuja el vano entre ellos y atenúa el resto. Sin la prop, §1.5 no cambia. */
  focus?: 'tritono';
  /** Con `focus="tritono"`: aria-label y tooltip del botón que toca el
   *  tritono y su resolución. Viene de la sección (i18n). */
  tritonoPlayLabel?: string;
}

// Reunión 19/10/26: "la idea del tritono es justamente escucharlo como suena
// junto". Las dos notas (4ª y 7ª) a la vez, con anillo ámbar mientras suenan.
// Reunión 22/11/26 (#1): enseguida suena la resolución, 3ª + 8va, y el ámbar
// pasa a esas dos notas.
const TRITONO_DURATION = 1.6;
const TRITONO_IDX = [3, 6];
const RESOLUCION_IDX = [2, 7];

export default function TensionResolucion({ focus, tritonoPlayLabel }: Props = {}) {
  const { i18n } = useTranslation();
  const isDe = i18n.language === "de";
  const tonic = useUIStore((s) => s.tonic);
  const nodes = useMemo(() => buildNodes(tonic), [tonic]);
  const { playSequence } = useAudioEngine();
  const fire = useFireGate();
  const [playingArrow, setPlayingArrow] = useState<string | null>(null);
  const [sonandoIdx, setSonandoIdx] = useState<number[]>([]);
  const { playChord, at, clear } = useChordPlayer(TRITONO_DURATION);

  const playResolution = useCallback(
    (fromIdx: number, toIdx: number, arrowId: string) => {
      if (!fire()) return;

      setPlayingArrow(arrowId);
      const from = nodes[fromIdx];
      const to = nodes[toIdx];
      // Dirección melódica de la resolución (tensa → estable), no se reordena.
      playSequence(
        [
          { name: from.note, octave: 4 + from.octaveAdj, ganancia: gananciaDe(from) },
          { name: to.note, octave: 4 + to.octaveAdj, ganancia: gananciaDe(to) },
        ],
        ARPEGGIO_GAP_MS,
        NOTE_TAIL_MS,
      );
      at(() => setPlayingArrow(null), ARPEGGIO_GAP_MS + NOTE_TAIL_MS + 400);
    },
    [playSequence, nodes, fire, at],
  );

  const playTritono = useCallback(() => {
    clear();
    const notas = (idx: number[]) =>
      idx.map((i) => ({
        chromatic: nodes[i].note,
        octave: 4 + nodes[i].octaveAdj,
        ganancia: gananciaDe(nodes[i]),
      }));
    const ms = TRITONO_DURATION * 1000;
    setSonandoIdx(TRITONO_IDX);
    playChord(notas(TRITONO_IDX), 0);
    at(() => setSonandoIdx(RESOLUCION_IDX), ms);
    playChord(notas(RESOLUCION_IDX), 0, ms);
    at(() => setSonandoIdx([]), 2 * ms);
  }, [clear, playChord, at, nodes]);

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${SVG_W} ${focus === 'tritono' ? SVG_H_TRITONO : SVG_H}`}
        role="img"
        aria-label={
          isDe
            ? `Karte der Spannungsauflösungen in ${formatNote(tonic, 'de')}-Dur`
            : `Mapa de resoluciones de tensión en ${spelledNameES(tonic)} mayor`
        }
      >
        {/* Punta en chevrón abierto, de tamaño fijo: se lee como señal y no
            crece con el trazo. Una por color porque el marcador no hereda el
            trazo de la flecha (ámbar solo mientras suena). */}
        <defs>
          {[
            { id: "tension-arrowhead", className: styles.arrowHead },
            { id: "tension-arrowhead-playing", className: styles.arrowHeadPlaying },
          ].map((m) => (
            <marker
              key={m.id}
              id={m.id}
              viewBox="0 0 10 10"
              markerWidth="9"
              markerHeight="9"
              refX="8"
              refY="5"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path d="M1,1 L9,5 L1,9" className={m.className} />
            </marker>
          ))}
        </defs>

        {/* Regla de los grados, entre los arcos de abajo y los números. */}
        <line
          x1={PAD_X}
          y1={AXIS_Y}
          x2={SVG_W - PAD_X}
          y2={AXIS_Y}
          className={styles.baseline}
        />

        {/* §3.6.1: el vano del tritono entre la 4ª y la 7ª, bajo el eje. */}
        {focus === 'tritono' && (
          <g className={styles.tritono} aria-hidden="true">
            <line x1={nodeX(nodes[3].pos)} y1={TRITONO_Y} x2={nodeX(nodes[6].pos)} y2={TRITONO_Y} />
            <line x1={nodeX(nodes[3].pos)} y1={TRITONO_Y - 5} x2={nodeX(nodes[3].pos)} y2={TRITONO_Y + 5} />
            <line x1={nodeX(nodes[6].pos)} y1={TRITONO_Y - 5} x2={nodeX(nodes[6].pos)} y2={TRITONO_Y + 5} />
            <text
              x={(nodeX(nodes[3].pos) + nodeX(nodes[6].pos)) / 2}
              y={TRITONO_Y + 18}
              className={styles.tritonoLabel}
            >
              {isDe ? 'Tritonus · 6 HT' : 'tritono · 6 s.t.'}
            </text>
          </g>
        )}

        {/* Resolution arrows above the strip. En el tritono (§3.6.1) la 4ª solo
            baja a la 3ª: "no sube a la quinta" (reunión 19/10/26). §1.5
            conserva las dos salidas del 4º grado. */}
        {ARROWS.filter(
          (a) => focus !== 'tritono' || (nodes[a.fromIdx].role === 'tense' && a.id !== 'f-g'),
        ).map((a) => {
          const from = nodes[a.fromIdx];
          const to = nodes[a.toIdx];
          return (
            <ArrowPath
              key={a.id}
              geometry={arrowGeometry(from, to)}
              ariaLabel={
                isDe
                  ? `Auflösung von ${NOTE_DE[from.note] ?? from.note} nach ${NOTE_DE[to.note] ?? to.note} spielen`
                  : `Reproducir resolución de ${NOTE_ES[from.note]} a ${NOTE_ES[to.note]}`
              }
              onPlay={() => playResolution(a.fromIdx, a.toIdx, a.id)}
              isPlaying={playingArrow === a.id}
              isDimmed={playingArrow !== null && playingArrow !== a.id}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <ScaleNode
            key={`${n.pos}-${i}`}
            data={n}
            sounding={sonandoIdx.includes(i)}
          />
        ))}
      </svg>

      {focus === 'tritono' && (
        <div className={styles.tritonoPlay}>
          <PlaybackButton
            mode="bloque"
            label={tritonoPlayLabel}
            playing={sonandoIdx.length > 0}
            onClick={playTritono}
          />
        </div>
      )}

      {/* Reunión 24/5/26: removidas las entradas "4ª/7ª tensos" y "2ª/6ª intermedios"
          del legend (la información ya está implícita en el strip y se duplica). */}
      <ul
        className={styles.legend}
        aria-label={isDe ? "Kartenkonventionen" : "Convenciones del mapa"}
      >
        <li>
          <span className={styles.swatchStable} />
          {isDe ? "Stabil" : "Estable"}
        </li>
        <li>
          <span className={styles.swatchIntermediate} />
          {isDe ? "Mittel" : "Intermedia"}
        </li>
        <li>
          <span className={styles.swatchTense} />
          {isDe ? "Spannend" : "Tensa"}
        </li>
      </ul>
    </div>
  );
}

interface ArrowPathProps {
  geometry: ArrowGeometry;
  ariaLabel: string;
  onPlay: () => void;
  isPlaying?: boolean;
  isDimmed?: boolean;
}

function ArrowPath({
  geometry,
  ariaLabel,
  onPlay,
  isPlaying,
  isDimmed,
}: ArrowPathProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent<SVGPathElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onPlay();
      }
    },
    [onPlay],
  );

  const { d } = geometry;
  const strokeWidth = isPlaying ? ARROW_WIDTH + 0.5 : ARROW_WIDTH;
  const opacity = isDimmed ? 0.25 : 1;

  return (
    <g>
      {/* Invisible hit box overlay with expanded stroke width for better accessibility */}
      <path
        d={d}
        strokeWidth={24}
        stroke="transparent"
        fill="none"
        pointerEvents="stroke"
        tabIndex={0}
        role="button"
        aria-label={ariaLabel}
        onClick={onPlay}
        onFocus={onPlay}
        onKeyDown={handleKey}
        style={{ cursor: "pointer" }}
      />
      {/* Visual arrow path */}
      <path
        d={d}
        className={isPlaying ? `${styles.arrow} ${styles.arrowPlaying}` : styles.arrow}
        strokeWidth={strokeWidth}
        opacity={opacity}
        markerEnd={isPlaying ? "url(#tension-arrowhead-playing)" : "url(#tension-arrowhead)"}
        pointerEvents="none"
        style={{ transition: "opacity 0.2s, stroke 0.15s" }}
      />
      {/* Distancia de la resolución en semitonos, en el formato +n del método. */}
      <text
        x={geometry.labelX}
        y={geometry.labelY}
        className={isPlaying ? styles.stepLabelPlaying : styles.stepLabel}
        opacity={opacity}
        aria-hidden="true"
      >
        {geometry.label}
      </text>
    </g>
  );
}

interface ScaleNodeProps {
  data: TensionNode;
  sounding?: boolean;
}

function ScaleNode({ data, sounding }: ScaleNodeProps) {
  const lang = useTranslation().i18n.language;
  const { pos, spelled, role } = data;
  const cx = nodeX(pos);
  const radius = nodeRadius(role);
  const fill =
    role === "tonic" || role === "stable"
      ? "var(--diatonic-stable)"
      : role === "intermediate"
        ? "var(--diatonic-medium)"
        : "var(--diatonic-tense)";
  const isLargeLetter = role === "tonic";

  return (
    <g className={styles.node} aria-hidden="true">
      {/* Ámbar = "sonando ahora" (Amber-Means-Sounding): solo mientras suena. */}
      {sounding && (
        <circle cx={cx} cy={NODE_Y} r={radius + 5} fill="none" stroke="var(--amber)" strokeWidth={2.5} />
      )}
      <circle
        cx={cx}
        cy={NODE_Y}
        r={radius}
        fill={fill}
        stroke={role === "tonic" ? "var(--paper)" : "none"}
        strokeWidth={role === "tonic" ? 2 : 0}
      />
      <text
        x={cx}
        y={NODE_Y + 1}
        className={isLargeLetter ? styles.innerLetterLarge : styles.innerLetter}
      >
        {formatNote(spelled, lang)}
      </text>
      <text x={cx} y={GRADE_Y} className={styles.gradeLabel}>
        {data.grade}
      </text>
    </g>
  );
}
