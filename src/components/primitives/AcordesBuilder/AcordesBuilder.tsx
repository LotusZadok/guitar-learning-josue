import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { useAudioEngine, stopAllNotes } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { NOTE_COLORS } from '../../../data/notes';
import {
  intervalMemberFromTonic,
  type IntervalMember,
  type IntervalNumber,
  type IntervalQuality,
} from '../../../utils/noteCalculations';
import PlaybackButton from '../../shared/PlaybackButton/PlaybackButton';
import styles from './AcordesBuilder.module.css';

// El "Nombre en latino" deriva del spelled (no del chromatic) para coincidir con
// el glifo del nodo. Mapea letra → solfeo, conservando ♭/♯.
const LETTER_ES: Record<string, string> = {
  C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si',
};
function spelledES(spelled: string): string {
  return (LETTER_ES[spelled[0]] ?? spelled[0]) + spelled.slice(1);
}

const ARPEGGIO_GAP_MS = 250;
const NOTE_DURATION = 1.4;
const FIRE_DEBOUNCE_MS = 150;
const R = 24; // radio de nodo

// === Topología del árbol (§1.7, recorte hasta la quinta) ===
// La tónica (raíz) ramifica a la tercera menor y la mayor; cada una llega a la
// quinta justa, y sólo 3m alcanza además la quinta disminuida. Las aristas
// codifican qué acordes son válidos (sus2/sus4 aún no aparecen: van en T3).
// Doble codificación posicional: el eje VERTICAL = distancia interválica (menos
// semitonos, más cerca de la línea de la tónica) y el eje HORIZONTAL = calidad
// (menor/disminuida a la izquierda, mayor/justa a la derecha).
type ThirdRole = '3m' | '3M';
type FifthRole = '5' | '5d';

interface NodeDef {
  role: string;
  number: IntervalNumber;
  quality: IntervalQuality;
  x: number;
  y: number;
}

const VB_W = 440;
const VB_H = 300;

const TONIC_NODE: NodeDef = { role: 'T', number: 1, quality: 'P', x: 46, y: 150 };

const THIRD_NODES: Record<ThirdRole, NodeDef> = {
  '3m': { role: '3m', number: 3, quality: 'm', x: 175, y: 92 },
  '3M': { role: '3M', number: 3, quality: 'M', x: 225, y: 208 },
};

const FIFTH_NODES: Record<FifthRole, NodeDef> = {
  '5d': { role: '5d', number: 5, quality: 'dim', x: 360, y: 78 },
  '5': { role: '5', number: 5, quality: 'P', x: 410, y: 196 },
};

// Acordes válidos por camino tercera→quinta. La presencia de una clave define
// la arista (y por ende la alcanzabilidad de cada quinta desde cada tercera).
const CHORDS: Record<string, { nombre: string; cifrado: string }> = {
  '3m-5': { nombre: 'menor', cifrado: 'm' },
  '3m-5d': { nombre: 'disminuido', cifrado: '°' },
  '3M-5': { nombre: 'mayor', cifrado: 'M' },
};

function pathKey(third: ThirdRole, fifth: FifthRole): string {
  return `${third}-${fifth}`;
}
function reaches(third: ThirdRole, fifth: FifthRole): boolean {
  return pathKey(third, fifth) in CHORDS;
}

export default function AcordesBuilder() {
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();

  const [third, setThird] = useState<ThirdRole | null>(null);
  const [fifth, setFifth] = useState<FifthRole | null>(null);
  const [playing, setPlaying] = useState(false);
  // null = idle; -1 = bloque (todos); 0..2 = índice arpegiado [T, 3ª, 5ª]
  const [playIdx, setPlayIdx] = useState<number | null>(null);
  const lastFire = useRef(0);

  // Notas (grafía + cromática + octava) de cada posición, según la tónica activa.
  const members = useMemo(() => {
    const m = (n: NodeDef) => intervalMemberFromTonic(tonic, n.number, n.quality);
    return {
      T: m(TONIC_NODE),
      thirds: Object.fromEntries(
        (Object.keys(THIRD_NODES) as ThirdRole[]).map((k) => [k, m(THIRD_NODES[k])]),
      ) as Record<ThirdRole, IntervalMember>,
      fifths: Object.fromEntries(
        (Object.keys(FIFTH_NODES) as FifthRole[]).map((k) => [k, m(FIFTH_NODES[k])]),
      ) as Record<FifthRole, IntervalMember>,
    };
  }, [tonic]);

  const chord = third && fifth && reaches(third, fifth) ? CHORDS[pathKey(third, fifth)] : null;
  const chordMembers: IntervalMember[] | null =
    third && fifth && chord
      ? [members.T, members.thirds[third], members.fifths[fifth]]
      : null;

  // Audio reversible (hover/focus/click de nodo): suena la nota sola. Debounce
  // compartido para no duplicar el disparo entre mouse-click y focus.
  const scrub = useCallback(
    (mem: IntervalMember) => {
      const now = Date.now();
      if (now - lastFire.current < FIRE_DEBOUNCE_MS) return;
      lastFire.current = now;
      playNote(mem.chromatic, mem.octave, NOTE_DURATION);
    },
    [playNote],
  );

  // Selección de camino (decisión persistente). Elegir tercera resetea la quinta
  // si dejara de ser alcanzable; re-clic deselecciona.
  const pickThird = useCallback((role: ThirdRole) => {
    setThird((prev) => {
      const next = prev === role ? null : role;
      setFifth((f) => (next && f && reaches(next, f) ? f : null));
      return next;
    });
  }, []);

  const pickFifth = useCallback(
    (role: FifthRole) => {
      if (!third || !reaches(third, role)) return;
      setFifth((prev) => (prev === role ? null : role));
    },
    [third],
  );

  const playBlock = useCallback(() => {
    if (playing || !chordMembers) return;
    setPlaying(true);
    setPlayIdx(-1);
    chordMembers.forEach((m) => playNote(m.chromatic, m.octave, NOTE_DURATION));
    setTimeout(() => {
      setPlaying(false);
      setPlayIdx(null);
    }, NOTE_DURATION * 1000);
  }, [chordMembers, playNote, playing]);

  const playArpeggio = useCallback(() => {
    if (playing || !chordMembers) return;
    setPlaying(true);
    stopAllNotes();
    chordMembers.forEach((m, i) => {
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
      chordMembers.length * ARPEGGIO_GAP_MS + NOTE_DURATION * 1000,
    );
  }, [chordMembers, playNote, playing]);

  // Estado visual de cada nodo, en orden [T, 3ª, 5ª] para el highlight arpegiado.
  const activeChordIdx = (role: 'T' | ThirdRole | FifthRole): number => {
    if (role === 'T') return 0;
    if (role === third) return 1;
    if (role === fifth) return 2;
    return -1;
  };

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.tree}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="group"
        aria-label="Árbol constructor de acordes: elegí una tercera y luego una quinta"
      >
        {/* === aristas === */}
        {(Object.keys(THIRD_NODES) as ThirdRole[]).map((k) => {
          const n = THIRD_NODES[k];
          const active = third === k;
          return (
            <line
              key={`e-t-${k}`}
              className={active ? styles.edgeActive : styles.edge}
              x1={TONIC_NODE.x + R}
              y1={TONIC_NODE.y}
              x2={n.x - R}
              y2={n.y}
            />
          );
        })}
        {(Object.keys(CHORDS) as string[]).map((key) => {
          const [t, f] = key.split('-') as [ThirdRole, FifthRole];
          const tn = THIRD_NODES[t];
          const fn = FIFTH_NODES[f];
          const active = third === t && fifth === f;
          return (
            <line
              key={`e-${key}`}
              className={active ? styles.edgeActive : styles.edge}
              x1={tn.x + R}
              y1={tn.y}
              x2={fn.x - R}
              y2={fn.y}
            />
          );
        })}

        {/* === tónica (raíz, siempre activa) === */}
        <Node
          def={TONIC_NODE}
          member={members.T}
          state="tonic"
          playing={playIdx === -1 || playIdx === activeChordIdx('T')}
          onScrub={scrub}
        />

        {/* === terceras === */}
        {(Object.keys(THIRD_NODES) as ThirdRole[]).map((k) => (
          <Node
            key={k}
            def={THIRD_NODES[k]}
            member={members.thirds[k]}
            state={third === k ? 'selected' : 'idle'}
            playing={third === k && (playIdx === -1 || playIdx === activeChordIdx(k))}
            onSelect={() => pickThird(k)}
            onScrub={scrub}
          />
        ))}

        {/* === quintas === */}
        {(Object.keys(FIFTH_NODES) as FifthRole[]).map((k) => {
          const reachable = third != null && reaches(third, k);
          return (
            <Node
              key={k}
              def={FIFTH_NODES[k]}
              member={members.fifths[k]}
              state={fifth === k ? 'selected' : reachable ? 'idle' : 'disabled'}
              playing={fifth === k && (playIdx === -1 || playIdx === activeChordIdx(k))}
              onSelect={reachable ? () => pickFifth(k) : undefined}
              onScrub={reachable ? scrub : undefined}
            />
          );
        })}
      </svg>

      <div className={styles.readout} role="status" aria-live="polite">
        {chord && chordMembers ? (
          <>
            <p className={styles.chordName}>
              {spelledES(chordMembers[0].spelled)} {chord.nombre}
              <span className={styles.cifrado}>
                {chordMembers[0].spelled}
                {chord.cifrado}
              </span>
            </p>
            <p className={styles.chordNotes}>
              {chordMembers.map((m) => m.spelled).join('  ')}
            </p>
            <div className={styles.audioRow}>
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
          </>
        ) : (
          <p className={styles.hint}>
            {third
              ? 'Elegí una quinta para completar el acorde.'
              : 'Elegí una tercera para empezar a construir.'}
          </p>
        )}
      </div>
    </div>
  );
}

// === Nodo del árbol ===
type NodeState = 'tonic' | 'selected' | 'idle' | 'disabled';

interface NodeProps {
  def: NodeDef;
  member: IntervalMember;
  state: NodeState;
  playing?: boolean;
  onSelect?: () => void;
  onScrub?: (m: IntervalMember) => void;
}

function Node({ def, member, state, playing, onSelect, onScrub }: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const interactive = state !== 'disabled' && (onSelect != null || state === 'tonic');

  const enter = useCallback(() => {
    if (state === 'disabled') return;
    setHovered(true);
    onScrub?.(member);
  }, [member, onScrub, state]);
  const leave = useCallback(() => setHovered(false), []);
  const click = useCallback(() => onSelect?.(), [onSelect]);
  const onKey = useCallback(
    (e: KeyboardEvent<SVGGElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect?.();
        onScrub?.(member);
      }
    },
    [member, onScrub, onSelect],
  );

  // Color sólo en hover / selección / reproducción (Note-Color Quarantine). El
  // glifo blanco de la nota sobre el círculo saturado es la excepción Signature.
  const colored = hovered || playing || state === 'selected' || state === 'tonic';
  const fill = colored ? NOTE_COLORS[member.chromatic] : 'var(--surface)';
  const stroke = state === 'tonic' || colored ? 'none' : 'var(--rule)';

  const nameES = spelledES(member.spelled);
  const ariaSelected = state === 'selected' ? ', seleccionado' : '';
  // Carril tipográfico de calidad: mayor/justa = bold recto; menor/disminuida =
  // regular itálica. Da una segunda señal (peso + estilo) además del caso m/M,
  // que en monoespaciado es demasiado sutil para leerse de un vistazo.
  const major = def.quality === 'M' || def.quality === 'P';
  const roleClass = `${styles.nodeRole} ${major ? styles.roleMajor : styles.roleMinor}`;

  return (
    <g
      className={`${styles.node} ${state === 'disabled' ? styles.nodeDisabled : ''}`}
      transform={`translate(${def.x},${def.y})`}
      role={onSelect ? 'button' : 'img'}
      aria-pressed={onSelect ? state === 'selected' : undefined}
      aria-label={`${def.role} · ${nameES}${ariaSelected}`}
      tabIndex={interactive ? 0 : -1}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      onClick={onSelect ? click : undefined}
      onKeyDown={onSelect ? onKey : undefined}
    >
      <circle className={styles.hit} cx={0} cy={0} r={R + 6} fill="transparent" />
      {playing && (
        <circle cx={0} cy={0} r={R + 5} fill="none" stroke="var(--amber)" strokeWidth={2} />
      )}
      <circle cx={0} cy={0} r={R} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {/* Reposo: rol (función) en Plex Mono, que preserva mayús/minús (así 3m≠3M
          y 5d≠5). Activo: glifo de la nota en Bebas, blanco sobre el círculo
          saturado (excepción Signature). */}
      <text
        className={colored ? styles.nodeGlyph : roleClass}
        x={0}
        y={1}
        fill={colored ? '#fff' : 'var(--text-body)'}
        style={colored && member.spelled.length > 2 ? { fontSize: '13px' } : undefined}
      >
        {colored ? member.spelled : def.role}
      </text>
      <text
        className={
          colored ? `${styles.nodeName} ${major ? styles.roleMajor : styles.roleMinor}` : styles.nodeName
        }
        x={0}
        y={R + 18}
        fill="var(--muted)"
      >
        {colored ? def.role : nameES}
      </text>
    </g>
  );
}
