import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { NOTE_COLORS, spelledToES } from '../../../data/notes';
import {
  intervalMemberFromTonic,
  type IntervalMember,
  type IntervalNumber,
  type IntervalQuality,
} from '../../../utils/noteCalculations';
import PlaybackButton from '../../shared/PlaybackButton/PlaybackButton';
import type { Tonic } from '../../../types/music';
import styles from './ChordStacks.module.css';

// Comparación de acordes como stacks verticales (7ª arriba → tónica abajo, como
// en partitura). Cada tono lleva su número de intervalo + calidad para derivar
// grafía + audio desde la tónica activa. `moves` marca el/los tono(s) que
// cambian entre las columnas (resaltados para que el ojo capte la diferencia).
// Usado por 3.1.2 (maj7/m7/7) y 3.2 (m7♭5/dim7).
export interface Tone {
  role: string;
  number: IntervalNumber;
  quality: IntervalQuality;
  moves?: boolean;
}

export interface ChordDef {
  suffix: string;
  tones: Tone[]; // de arriba (7ª) hacia abajo (tónica)
}

interface Props {
  chords: ChordDef[];
}

const NOTE_DURATION = 1.4;
const ARPEGGIO_GAP_MS = 230;
const FIRE_DEBOUNCE_MS = 150;
const R = 16;

const SVG_W = 118;
const TOP_Y = 30;
const STEP_Y = 46;
const NODE_X = 74;
const ROLE_X = 24;

export default function ChordStacks({ chords }: Props) {
  const tonic = useUIStore((s) => s.tonic);
  return (
    <div className={styles.row}>
      {chords.map((c) => (
        <ChordColumn key={c.suffix} chord={c} tonic={tonic} />
      ))}
    </div>
  );
}

interface ChordColumnProps {
  chord: ChordDef;
  tonic: Tonic;
}

function ChordColumn({ chord, tonic }: ChordColumnProps) {
  const { playNote } = useAudioEngine();
  const [playing, setPlaying] = useState(false);
  const [playIdx, setPlayIdx] = useState<number | null>(null); // -1 bloque; 0..n arpegio (asc)
  const [hovered, setHovered] = useState<number | null>(null);
  const lastFire = useRef(0);

  // Tonos en orden de apilado (7ª→T) para el render; ascendente (T→7ª) para audio.
  const stacked = useMemo(
    () => chord.tones.map((t) => ({ tone: t, m: intervalMemberFromTonic(tonic, t.number, t.quality) })),
    [chord, tonic],
  );
  const ascending = useMemo(() => [...stacked].reverse(), [stacked]);
  const tonicSpelled = ascending[0].m.spelled;
  const svgH = TOP_Y + (stacked.length - 1) * STEP_Y + R + 8;

  const scrub = useCallback(
    (m: IntervalMember) => {
      const now = Date.now();
      if (now - lastFire.current < FIRE_DEBOUNCE_MS) return;
      lastFire.current = now;
      playNote(m.chromatic, m.octave, NOTE_DURATION);
    },
    [playNote],
  );

  const playBlock = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    setPlayIdx(-1);
    ascending.forEach(({ m }) => playNote(m.chromatic, m.octave, NOTE_DURATION));
    setTimeout(() => {
      setPlaying(false);
      setPlayIdx(null);
    }, NOTE_DURATION * 1000);
  }, [ascending, playNote, playing]);

  const playArpeggio = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    ascending.forEach(({ m }, i) => {
      setTimeout(() => {
        playNote(m.chromatic, m.octave, NOTE_DURATION);
        setPlayIdx(i);
      }, i * ARPEGGIO_GAP_MS);
    });
    setTimeout(
      () => {
        setPlaying(false);
        setPlayIdx(null);
      },
      ascending.length * ARPEGGIO_GAP_MS + NOTE_DURATION * 1000,
    );
  }, [ascending, playNote, playing]);

  // playIdx (asc) → índice apilado (7ª arriba): apilado = (n-1) - asc.
  const ascToStacked = (asc: number) => stacked.length - 1 - asc;

  return (
    <div className={styles.col}>
      <div className={styles.cifrado}>
        {tonicSpelled}
        <span className={styles.suffix}>{chord.suffix}</span>
      </div>

      <svg className={styles.stack} viewBox={`0 0 ${SVG_W} ${svgH}`} aria-hidden="true">
        {stacked.map(({ tone, m }, i) => {
          const y = TOP_Y + i * STEP_Y;
          const isPlaying = playIdx === -1 || (playIdx != null && ascToStacked(playIdx) === i);
          const colored = hovered === i || isPlaying;
          return (
            <g
              key={tone.role}
              transform={`translate(0,${y})`}
              role="button"
              tabIndex={0}
              aria-label={`${tone.role} · ${spelledToES(m.spelled)}`}
              onMouseEnter={() => {
                setHovered(i);
                scrub(m);
              }}
              onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
              onFocus={() => {
                setHovered(i);
                scrub(m);
              }}
              onBlur={() => setHovered((h) => (h === i ? null : h))}
              onKeyDown={(e: KeyboardEvent<SVGGElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  scrub(m);
                }
              }}
            >
              <text
                className={tone.moves ? `${styles.role} ${styles.roleMoves}` : styles.role}
                x={ROLE_X}
                y={0}
              >
                {tone.role}
              </text>
              <circle className={styles.hit} cx={NODE_X} cy={0} r={R + 5} fill="transparent" />
              <circle
                cx={NODE_X}
                cy={0}
                r={R}
                fill={colored ? NOTE_COLORS[m.chromatic] : 'var(--surface)'}
                stroke={colored ? 'none' : 'var(--rule)'}
                strokeWidth={1.5}
              />
              {/* Glifo de nota blanco sobre el círculo saturado en hover/playing:
                  excepción Signature, no tokenizar. */}
              <text
                className={styles.glyph}
                x={NODE_X}
                y={1}
                fill={colored ? '#fff' : 'var(--text-body)'}
                style={m.spelled.length > 2 ? { fontSize: '12px' } : undefined}
              >
                {m.spelled}
              </text>
            </g>
          );
        })}
      </svg>

      <div className={styles.controls}>
        <PlaybackButton
          mode="bloque"
          onClick={playBlock}
          playing={playIdx === -1}
          disabled={playing}
        />
        <PlaybackButton
          mode="arpegio"
          onClick={playArpeggio}
          playing={playing && playIdx !== -1}
          disabled={playing}
        />
      </div>
    </div>
  );
}
