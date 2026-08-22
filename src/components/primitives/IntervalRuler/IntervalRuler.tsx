import { useCallback, useMemo, useState, type KeyboardEvent } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useFireGate } from '../../../hooks/useFireGate';
import { useUIStore } from '../../../stores/useUIStore';
import { NOTE_COLORS, spelledToES } from '../../../data/notes';
import {
  intervalMemberFromTonic,
  type IntervalMember,
  type IntervalNumber,
  type IntervalQuality,
} from '../../../utils/noteCalculations';
import styles from './IntervalRuler.module.css';

const NOTE_DURATION = 1.4;
const R = 17;

// Regla de intervalos: eje de semitonos desde la tónica. La posición de cada
// nodo codifica su distancia real en semitonos. Config-driven: las paradas
// (stops) las pasa la sección, así sirve para las séptimas (§3.1.1), la 2ª/4ª
// (§3.3.1) y futuros recaps de intervalo.
export interface RulerStop {
  role: string;
  number: IntervalNumber;
  quality: IntervalQuality;
  semis: number;
  showSemis?: boolean; // muestra el número de semitonos encima del nodo
  reference?: boolean; // nodo atenuado de referencia (no es el sujeto)
}

interface Props {
  stops: RulerStop[];
  ariaLabel: string;
  maxSemis?: number;
}

const VB_W = 580;
const VB_H = 168;
const AXIS_Y = 74;
const PAD = 40;

export default function IntervalRuler({ stops, ariaLabel, maxSemis }: Props) {
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();
  const [active, setActive] = useState<number | null>(null);
  const fire = useFireGate();

  const max = maxSemis ?? Math.max(...stops.map((s) => s.semis));
  const scale = (VB_W - 2 * PAD) / max;
  const xAt = useCallback((semis: number) => PAD + semis * scale, [scale]);

  const members = useMemo(
    () => stops.map((s) => intervalMemberFromTonic(tonic, s.number, s.quality)),
    [stops, tonic],
  );

  const scrub = useCallback(
    (m: IntervalMember) => {
      if (!fire()) return;
      playNote(m.chromatic, m.octave, NOTE_DURATION);
    },
    [playNote, fire],
  );

  return (
    <svg
      className={styles.ruler}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="group"
      aria-label={ariaLabel}
    >
      {/* eje + ticks */}
      <line className={styles.axis} x1={xAt(0)} y1={AXIS_Y} x2={xAt(max)} y2={AXIS_Y} />
      {Array.from({ length: max + 1 }, (_, s) => (
        <line
          key={s}
          className={styles.tick}
          x1={xAt(s)}
          y1={AXIS_Y - 4}
          x2={xAt(s)}
          y2={AXIS_Y + 4}
        />
      ))}

      {stops.map((stop, i) => (
        <Node
          key={stop.role}
          stop={stop}
          x={xAt(stop.semis)}
          member={members[i]}
          active={active === i}
          onEnter={() => {
            setActive(i);
            scrub(members[i]);
          }}
          onLeave={() => setActive((a) => (a === i ? null : a))}
          onActivate={() => scrub(members[i])}
        />
      ))}
    </svg>
  );
}

interface NodeProps {
  stop: RulerStop;
  x: number;
  member: IntervalMember;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onActivate: () => void;
}

function Node({ stop, x, member, active, onEnter, onLeave, onActivate }: NodeProps) {
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
  const fill = colored ? NOTE_COLORS[member.chromatic] : 'var(--surface)';
  const stroke = colored ? 'none' : 'var(--rule)';
  const nameES = spelledToES(member.spelled);

  return (
    <g
      className={`${styles.node} ${stop.reference ? styles.reference : ''}`}
      transform={`translate(${x},${AXIS_Y})`}
      role="button"
      aria-label={`${stop.role} · ${nameES}${stop.showSemis ? ` · ${stop.semis} semitonos` : ''}`}
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
      {/* Glifo: rol en reposo (Plex Mono preserva el caso); en activo, la nota
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
      {stop.showSemis && (
        <text className={styles.semis} x={0} y={-R - 9} fill="var(--muted)">
          {stop.semis}
        </text>
      )}
    </g>
  );
}
