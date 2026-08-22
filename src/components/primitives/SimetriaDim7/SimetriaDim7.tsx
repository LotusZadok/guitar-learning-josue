import { useCallback, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioEngine, stopAllNotes } from '../../../hooks/useAudioEngine';
import { ALL, NOTE_COLORS } from '../../../data/notes';
import { useUIStore } from '../../../stores/useUIStore';
import { tonicChromatic } from '../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../types/music';
import PlaybackButton from '../../shared/PlaybackButton/PlaybackButton';
import styles from './SimetriaDim7.module.css';

// 3.2 · La simetría del dim7 sobre el círculo cromático. Cada dim7 es un
// cuadrado inscrito (4 notas cada 3 semitonos), así que solo existen tres: el
// mismo cuadrado rotado un semitono. Reemplaza las tres líneas de texto
// (C° = E♭° = G♭° = A° …) por el diagrama que las hace audibles.
const CX = 200, CY = 200, R = 140, NODE_R = 24;
const NOTE_DURATION = 1.4;
const ARPEGGIO_GAP_MS = 250;
const OCTAVE = 4; // identidad absoluta: la familia no depende de la tónica activa

// Grafía de cada familia tal como la escribe el método (G♭ y no F♯ en la
// primera, B♭ y no A♯ en la segunda): dentro de un acorde la grafía depende del
// acorde, no de la tecla.
interface Member { note: ChromaticNote; label: string }
const FAMILIES: { symbol: string; members: Member[] }[] = [
  {
    symbol: 'C°',
    members: [
      { note: 'C', label: 'C' }, { note: 'D#', label: 'E♭' },
      { note: 'F#', label: 'G♭' }, { note: 'A', label: 'A' },
    ],
  },
  {
    symbol: 'C♯°',
    members: [
      { note: 'C#', label: 'C♯' }, { note: 'E', label: 'E' },
      { note: 'G', label: 'G' }, { note: 'A#', label: 'B♭' },
    ],
  },
  {
    symbol: 'D°',
    members: [
      { note: 'D', label: 'D' }, { note: 'F', label: 'F' },
      { note: 'G#', label: 'A♭' }, { note: 'B', label: 'B' },
    ],
  },
];

// Grafía neutra de los nodos que no son miembros de la familia activa (misma
// convención que el círculo de §2.8).
const IDLE_LABELS: Partial<Record<ChromaticNote, string>> = {
  'C#': 'C♯', 'D#': 'E♭', 'F#': 'F♯', 'G#': 'A♭', 'A#': 'B♭',
};

function nodePos(idx: number) {
  const rad = (idx * 30 - 90) * (Math.PI / 180);
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
}
const NODES = ALL.map((note, i) => ({ note, ...nodePos(i) }));

// Cada familia es un cuadrado: sus 4 notas están cada 3 semitonos, así que la
// familia de una nota es su índice cromático módulo 3.
const familyOf = (note: ChromaticNote) => ALL.indexOf(note) % 3;
const squarePath = (family: number) =>
  FAMILIES[family].members
    .map((m, i) => `${i === 0 ? 'M' : 'L'} ${nodePos(ALL.indexOf(m.note)).x} ${nodePos(ALL.indexOf(m.note)).y}`)
    .join(' ') + ' Z';

export default function SimetriaDim7() {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const { playNote } = useAudioEngine();
  const tonicChrom = tonicChromatic(useUIStore((s) => s.tonic));
  const [active, setActive] = useState(() => familyOf(tonicChrom));
  const [hovered, setHovered] = useState<ChromaticNote | null>(null);
  const [playing, setPlaying] = useState<'bloque' | 'arpegio' | null>(null);
  const timers = useRef<number[]>([]);

  // Las tres familias son absolutas (el dim7 es simétrico: existen tres y no
  // dependen de la tonalidad), así que la tónica global no re-ancla el círculo.
  // Lo que sí hace es elegir de qué familia se habla: la tónica activa pertenece
  // a exactamente una. Un clic posterior manda hasta el próximo cambio de tónica.
  //
  // Ajuste en render (patrón documentado de React para "resetear estado cuando
  // cambia un prop") en vez de un efecto: el efecto pintaba un frame con la
  // familia vieja antes de corregirse.
  const [prevTonic, setPrevTonic] = useState(tonicChrom);
  if (prevTonic !== tonicChrom) {
    setPrevTonic(tonicChrom);
    setActive(familyOf(tonicChrom));
  }

  const family = FAMILIES[active];
  const labelOf = useCallback(
    (note: ChromaticNote) =>
      family.members.find((m) => m.note === note)?.label ?? IDLE_LABELS[note] ?? note,
    [family],
  );

  const scrub = useCallback(
    (note: ChromaticNote) => playNote(note, OCTAVE, NOTE_DURATION),
    [playNote],
  );

  // Clic en cualquier nota: suena y salta a la familia a la que pertenece — así
  // las 12 notas son alcanzables y se ve que las tres familias las reparten sin
  // sobras.
  const pick = useCallback(
    (note: ChromaticNote) => {
      setActive(familyOf(note));
      scrub(note);
    },
    [scrub],
  );

  const play = useCallback(
    (mode: 'bloque' | 'arpegio') => {
      if (playing) return;
      timers.current.forEach(clearTimeout);
      timers.current = [];
      stopAllNotes();
      setPlaying(mode);
      const gap = mode === 'arpegio' ? ARPEGGIO_GAP_MS : 0;
      family.members.forEach((m, i) => {
        timers.current.push(
          window.setTimeout(() => playNote(m.note, OCTAVE, NOTE_DURATION), i * gap),
        );
      });
      timers.current.push(
        window.setTimeout(
          () => setPlaying(null),
          family.members.length * gap + NOTE_DURATION * 1000,
        ),
      );
    },
    [family, playNote, playing],
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.selector} role="group" aria-label={isDe ? 'Verminderte Familie' : 'Familia disminuida'}>
        {FAMILIES.map((f, i) => (
          <button
            key={f.symbol}
            type="button"
            className={i === active ? styles.chipActive : styles.chip}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            {f.symbol}
          </button>
        ))}
      </div>

      <svg
        className={styles.svg}
        viewBox="0 0 400 400"
        role="group"
        aria-label={isDe
          ? `Chromatischer Kreis: der verminderte Septakkord ${family.symbol} als eingeschriebenes Quadrat`
          : `Círculo cromático: el acorde disminuido ${family.symbol} como cuadrado inscrito`}
      >
        {/* Las otras dos familias quedan de fondo: el mismo cuadrado, rotado. */}
        {FAMILIES.map((_, i) =>
          i === active ? null : (
            <path key={i} d={squarePath(i)} className={styles.squareIdle} />
          ),
        )}
        <path d={squarePath(active)} className={styles.square} />

        {NODES.map(({ note, x, y }) => {
          const member = familyOf(note) === active;
          const isHovered = hovered === note;
          const colored = member || isHovered;
          return (
            <g
              key={note}
              className={styles.node}
              style={{ transformOrigin: `${x}px ${y}px` }}
              tabIndex={0}
              role="button"
              aria-label={isDe
                ? `${labelOf(note)}${member ? ` (Teil von ${family.symbol})` : ''}: Ton abspielen`
                : `${labelOf(note)}${member ? ` (parte de ${family.symbol})` : ''}: reproducir nota`}
              onMouseEnter={() => { setHovered(note); scrub(note); }}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(note)}
              onBlur={() => setHovered(null)}
              onClick={() => pick(note)}
              onKeyDown={(e: KeyboardEvent<SVGGElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  pick(note);
                }
              }}
            >
              <circle
                cx={x}
                cy={y}
                r={NODE_R}
                fill={colored ? NOTE_COLORS[note] : 'var(--surface)'}
                stroke={member ? 'var(--paper)' : colored ? 'var(--amber)' : 'var(--rule)'}
                strokeWidth={member ? 2.5 : 1}
              />
              <text
                x={x}
                y={y}
                className={styles.noteText}
                fill={colored ? '#fff' : 'var(--text-body)'}
              >
                {labelOf(note)}
              </text>
              {note === tonicChrom && (
                <text x={x} y={y + NODE_R + 13} className={styles.tonicMark}>
                  T
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <p className={styles.readout}>
        {family.members.map((m) => `${m.label}°`).join(' = ')}
      </p>

      <div className={styles.audioRow}>
        <PlaybackButton mode="bloque" onClick={() => play('bloque')} playing={playing === 'bloque'} disabled={playing != null} />
        <PlaybackButton mode="arpegio" onClick={() => play('arpegio')} playing={playing === 'arpegio'} disabled={playing != null} />
      </div>
    </div>
  );
}
