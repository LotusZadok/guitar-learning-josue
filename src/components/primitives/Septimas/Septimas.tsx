import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { NOTE_COLORS } from '../../../data/notes';
import {
  intervalMemberFromTonic,
  type IntervalMember,
  type IntervalNumber,
  type IntervalQuality,
} from '../../../utils/noteCalculations';
import styles from './Septimas.module.css';

const LETTER_ES: Record<string, string> = {
  C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si',
};
function spelledES(spelled: string): string {
  return (LETTER_ES[spelled[0]] ?? spelled[0]) + spelled.slice(1);
}

const NOTE_DURATION = 1.4;
const STEP_MS = 240;
const FIRE_DEBOUNCE_MS = 150;
const R = 17;

// Regla de las séptimas: eje de 0 a 12 semitonos desde la tónica. Las tres
// séptimas (7d=9, 7m=10, 7M=11) se agrupan justo antes de la octava (12). La
// posición sobre el eje codifica la distancia real en semitonos, dejando ver
// que la 7d está un semitono por debajo de la 7m.
interface Stop {
  role: string;
  number: IntervalNumber;
  quality: IntervalQuality;
  semis: number;
  seventh?: boolean;
}

const STOPS: Stop[] = [
  { role: 'T', number: 1, quality: 'P', semis: 0 },
  { role: '7d', number: 7, quality: 'dim', semis: 9, seventh: true },
  { role: '7m', number: 7, quality: 'm', semis: 10, seventh: true },
  { role: '7M', number: 7, quality: 'M', semis: 11, seventh: true },
  { role: '8', number: 8, quality: 'P', semis: 12 },
];

const VB_W = 580;
const VB_H = 168;
const AXIS_Y = 74;
const PAD = 40;
const SCALE = (VB_W - 2 * PAD) / 12; // px por semitono

function xAt(semis: number): number {
  return PAD + semis * SCALE;
}

export default function Septimas() {
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();
  const [active, setActive] = useState<number | null>(null);
  const lastFire = useRef(0);

  const members = useMemo(
    () => STOPS.map((s) => intervalMemberFromTonic(tonic, s.number, s.quality)),
    [tonic],
  );

  const scrub = useCallback(
    (m: IntervalMember) => {
      const now = Date.now();
      if (now - lastFire.current < FIRE_DEBOUNCE_MS) return;
      lastFire.current = now;
      playNote(m.chromatic, m.octave, NOTE_DURATION);
    },
    [playNote],
  );

  // Click: suena el intervalo (tónica → séptima) para oír la distancia.
  const playInterval = useCallback(
    (i: number) => {
      const t = members[0];
      const m = members[i];
      playNote(t.chromatic, t.octave, NOTE_DURATION);
      setTimeout(() => playNote(m.chromatic, m.octave, NOTE_DURATION), STEP_MS);
    },
    [members, playNote],
  );

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.ruler}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="group"
        aria-label="Regla de séptimas: distancia en semitonos desde la tónica hasta la octava"
      >
        {/* eje + ticks */}
        <line className={styles.axis} x1={xAt(0)} y1={AXIS_Y} x2={xAt(12)} y2={AXIS_Y} />
        {Array.from({ length: 13 }, (_, s) => (
          <line
            key={s}
            className={styles.tick}
            x1={xAt(s)}
            y1={AXIS_Y - 4}
            x2={xAt(s)}
            y2={AXIS_Y + 4}
          />
        ))}

        {STOPS.map((stop, i) => (
          <Node
            key={stop.role}
            stop={stop}
            member={members[i]}
            active={active === i}
            onEnter={() => {
              setActive(i);
              scrub(members[i]);
            }}
            onLeave={() => setActive((a) => (a === i ? null : a))}
            onActivate={() => (stop.seventh ? playInterval(i) : scrub(members[i]))}
          />
        ))}
      </svg>

      <p className={styles.legend}>
        Pasá o tocá cada nodo: la <strong>7d</strong> está un semitono por debajo de la{' '}
        <strong>7m</strong>, y la <strong>7m</strong> uno por debajo de la <strong>7M</strong>.
      </p>
    </div>
  );
}

interface NodeProps {
  stop: Stop;
  member: IntervalMember;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onActivate: () => void;
}

function Node({ stop, member, active, onEnter, onLeave, onActivate }: NodeProps) {
  const onKey = useCallback(
    (e: KeyboardEvent<SVGGElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
      }
    },
    [onActivate],
  );

  const colored = active;
  const isSeventh = !!stop.seventh;
  const fill = colored ? NOTE_COLORS[member.chromatic] : 'var(--surface)';
  const stroke = colored ? 'none' : 'var(--rule)';
  const nameES = spelledES(member.spelled);

  return (
    <g
      className={styles.node}
      transform={`translate(${xAt(stop.semis)},${AXIS_Y})`}
      role="button"
      aria-label={`${stop.role} · ${nameES}${isSeventh ? ` · ${stop.semis} semitonos` : ''}`}
      tabIndex={0}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={onActivate}
      onKeyDown={onKey}
    >
      <circle className={styles.hit} cx={0} cy={0} r={R + 6} fill="transparent" />
      <circle cx={0} cy={0} r={R} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {/* Glifo: rol en reposo (Plex Mono preserva 7m≠7M≠7d); en activo, la nota
          en blanco sobre el círculo saturado (excepción Signature, no tokenizar). */}
      <text
        className={colored ? styles.glyph : styles.role}
        x={0}
        y={1}
        fill={colored ? '#fff' : 'var(--text-body)'}
        style={colored && member.spelled.length > 2 ? { fontSize: '11px' } : undefined}
      >
        {colored ? member.spelled : stop.role}
      </text>
      <text className={styles.name} x={0} y={R + 17} fill="var(--muted)">
        {colored ? stop.role : nameES}
      </text>
      {isSeventh && (
        <text className={styles.semis} x={0} y={-R - 9} fill="var(--muted)">
          {stop.semis}
        </text>
      )}
    </g>
  );
}
