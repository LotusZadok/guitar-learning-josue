import { useCallback, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useAudioEngine, stopAllNotes } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { NOTE_COLORS, spelledToES } from '../../../data/notes';
import {
  intervalMemberFromTonic,
  type IntervalMember,
} from '../../../utils/noteCalculations';
import PlaybackButton from '../../shared/PlaybackButton/PlaybackButton';
import { BUILDER_17, type BuilderConfig, type BuilderNode } from './configs';
import styles from './AcordesBuilder.module.css';

const ARPEGGIO_GAP_MS = 250;
const NOTE_DURATION = 1.4;
const FIRE_DEBOUNCE_MS = 150;
const R = 24; // radio de nodo

/** Centinela para `playingRole`: el acorde suena en bloque, no hay una sola nota. */
export const PLAYING_ALL = '*';

interface Props {
  config?: BuilderConfig;
  /** Camino forzado desde afuera (walkthrough). Si está presente, el árbol es
   *  controlado y `selected` interno queda en pausa. `undefined` = modo libre. */
  path?: string[];
  /** Rol del nodo que suena ahora; `PLAYING_ALL` si suena el acorde entero. */
  playingRole?: string | null;
  /** El estudiante tocó un nodo: el dueño del walkthrough debe soltar el control.
   *  Si no lo suelta, el clic no se refleja visualmente: `selected` sigue leyendo
   *  `path` mientras `internalSelected` diverge por debajo, invisible, hasta que
   *  `path` vuelva a `undefined`. */
  onUserPick?: () => void;
}

// Constructor de acordes como árbol de nodos, construido por camino (tercera →
// quinta → [séptima]). Config-driven: la topología (nodos, posiciones, caminos
// válidos) viene de `config`, así crece de §1.7 (hasta la quinta) hacia §3.4
// (completo) sin duplicar el componente.
export default function AcordesBuilder({ config = BUILDER_17, path, playingRole, onUserPick }: Props) {
  const tonic = useUIStore((s) => s.tonic);
  const { playNote } = useAudioEngine();

  // Camino seleccionado: roles en orden de nivel (sin 'T'). Ej: ['3M','5','7M'].
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const controlled = path !== undefined;
  const selected = controlled ? path : internalSelected;
  const [playing, setPlaying] = useState(false);
  const [playIdx, setPlayIdx] = useState<number | null>(null); // -1 bloque; 0..n arpegio
  const lastFire = useRef(0);

  const nodeByRole = useMemo(() => {
    const map = new Map<string, BuilderNode>();
    config.nodes.forEach((n) => map.set(n.role, n));
    return map;
  }, [config]);

  // Nota (grafía + cromática + octava) de la tónica y de cada nodo.
  const members = useMemo(() => {
    const map = new Map<string, IntervalMember>();
    map.set('T', intervalMemberFromTonic(tonic, 1, 'P'));
    config.nodes.forEach((n) => map.set(n.role, intervalMemberFromTonic(tonic, n.number, n.quality)));
    return map;
  }, [config, tonic]);

  const arraysEqual = (a: string[], b: string[]) =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  const currentChord = useMemo(
    () => config.chords.find((c) => arraysEqual(c.path, selected)) ?? null,
    [config, selected],
  );

  const chordMembers: IntervalMember[] | null = useMemo(() => {
    if (!currentChord) return null;
    return ['T', ...selected].map((r) => members.get(r)!);
  }, [currentChord, selected, members]);

  // Un nodo de nivel L es alcanzable si la selección llega AL MENOS al nivel
  // anterior (L-1) y existe un acorde cuyo prefijo coincide y continúa con él.
  // `>= L-1` (no `===`) deja re-elegir un nivel ya pasado (p.ej. cambiar de
  // tercera con una quinta ya elegida); al re-elegir, la selección se trunca.
  const isReachable = useCallback(
    (node: BuilderNode) => {
      const L = node.level;
      if (selected.length < L - 1) return false;
      return config.chords.some(
        (c) =>
          c.path.length >= L &&
          c.path.slice(0, L - 1).every((r, i) => r === selected[i]) &&
          c.path[L - 1] === node.role,
      );
    },
    [config, selected],
  );

  const isSelected = useCallback(
    (node: BuilderNode) => selected[node.level - 1] === node.role,
    [selected],
  );

  const scrub = useCallback(
    (mem: IntervalMember) => {
      const now = Date.now();
      if (now - lastFire.current < FIRE_DEBOUNCE_MS) return;
      lastFire.current = now;
      playNote(mem.chromatic, mem.octave, NOTE_DURATION);
    },
    [playNote],
  );

  const pickNode = useCallback(
    (node: BuilderNode) => {
      const L = node.level;
      setInternalSelected((prev) => {
        // Parte del camino visible (controlado o interno) para que soltar el
        // control se sienta continuo: el clic edita lo que el estudiante ve.
        const base = controlled ? path! : prev;
        return base[L - 1] === node.role
          ? base.slice(0, L - 1) // re-clic deselecciona
          : [...base.slice(0, L - 1), node.role];
      });
      onUserPick?.();
    },
    [controlled, path, onUserPick],
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

  // Cadena activa (incluye la tónica) para el highlight arpegiado y las aristas.
  const chain = useMemo(() => ['T', ...selected], [selected]);
  // La reproducción interna (los botones del readout) tiene prioridad: el
  // estudiante puede pulsar arpegio aunque el walkthrough esté manejando el
  // camino, y el destaque debe seguir a lo que realmente suena.
  const nodePlaying = (role: string) => {
    if (playIdx != null) return playIdx === -1 || chain[playIdx] === role;
    if (controlled) return playingRole === role || playingRole === PLAYING_ALL;
    return false;
  };

  // ¿Suena UNA nota concreta? (en bloque suenan todas: no se atenúa nada)
  // Mismo orden de prioridad que nodePlaying: lo interno manda si está activo.
  const soloPlaying =
    playIdx != null
      ? playIdx >= 0
      : controlled && playingRole != null && playingRole !== PLAYING_ALL;

  // Aristas: pares consecutivos de cada camino (T→path[0], path[i]→path[i+1]).
  const edges = useMemo(() => {
    const set = new Map<string, { from: string; to: string }>();
    config.chords.forEach((c) => {
      let prev = 'T';
      c.path.forEach((role) => {
        set.set(`${prev}->${role}`, { from: prev, to: role });
        prev = role;
      });
    });
    return [...set.values()];
  }, [config]);

  const isActiveEdge = (from: string, to: string) => {
    for (let i = 0; i < chain.length - 1; i++) {
      if (chain[i] === from && chain[i + 1] === to) return true;
    }
    return false;
  };

  const pos = (role: string): { x: number; y: number } =>
    role === 'T' ? config.tonic : nodeByRole.get(role)!;

  const tonicMember = members.get('T')!;

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.tree}
        viewBox={`0 0 ${config.width} ${config.height}`}
        role="group"
        aria-label={config.ariaLabel}
      >
        {/* === aristas === */}
        {edges.map(({ from, to }) => {
          const a = pos(from);
          const b = pos(to);
          return (
            <line
              key={`${from}->${to}`}
              className={isActiveEdge(from, to) ? styles.edgeActive : styles.edge}
              x1={a.x + R}
              y1={a.y}
              x2={b.x - R}
              y2={b.y}
            />
          );
        })}

        {/* === tónica (raíz, siempre activa) === */}
        <Node
          role="T"
          x={config.tonic.x}
          y={config.tonic.y}
          quality="P"
          member={tonicMember}
          state="tonic"
          playing={nodePlaying('T')}
          dimmed={soloPlaying && !nodePlaying('T')}
          onScrub={scrub}
        />

        {/* === nodos === */}
        {config.nodes.map((node) => {
          const selectedNode = isSelected(node);
          const reachable = isReachable(node);
          const state = selectedNode ? 'selected' : reachable ? 'idle' : 'disabled';
          const interactive = selectedNode || reachable;
          return (
            <Node
              key={node.role}
              role={node.role}
              x={node.x}
              y={node.y}
              quality={node.quality}
              member={members.get(node.role)!}
              state={state}
              playing={selectedNode && nodePlaying(node.role)}
              dimmed={soloPlaying && selectedNode && !nodePlaying(node.role)}
              onSelect={interactive ? () => pickNode(node) : undefined}
              onScrub={interactive ? scrub : undefined}
            />
          );
        })}
      </svg>

      <div className={styles.readout} role="status" aria-live="polite">
        {currentChord && chordMembers ? (
          <>
            <p className={styles.chordName}>
              {tonicMember.spelled}
              {currentChord.cifrado}
              <span className={styles.chordAlias}>
                {spelledToES(tonicMember.spelled)} {currentChord.nombre}
              </span>
            </p>
            <p className={styles.chordNotes}>{chordMembers.map((m) => m.spelled).join('  ')}</p>
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
        ) : controlled ? null : (
          <p className={styles.hint}>
            {selected.length === 0
              ? 'Elegí una tercera para empezar a construir.'
              : 'Seguí eligiendo notas para completar un acorde.'}
          </p>
        )}
      </div>
    </div>
  );
}

// === Nodo del árbol ===
type NodeState = 'tonic' | 'selected' | 'idle' | 'disabled';

interface NodeProps {
  role: string;
  x: number;
  y: number;
  quality: BuilderNode['quality'];
  member: IntervalMember;
  state: NodeState;
  playing?: boolean;
  dimmed?: boolean;
  onSelect?: () => void;
  onScrub?: (m: IntervalMember) => void;
}

function Node({ role, x, y, quality, member, state, playing, dimmed, onSelect, onScrub }: NodeProps) {
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

  const nameES = spelledToES(member.spelled);
  const ariaSelected = state === 'selected' ? ', seleccionado' : '';
  // Carril tipográfico de calidad: mayor/justa = bold recto; menor/disminuida =
  // regular itálica. Da una segunda señal (peso + estilo) además del caso m/M,
  // que en monoespaciado es demasiado sutil para leerse de un vistazo.
  const major = quality === 'M' || quality === 'P';
  const roleClass = `${styles.nodeRole} ${major ? styles.roleMajor : styles.roleMinor}`;

  return (
    <g
      className={`${styles.node} ${state === 'disabled' ? styles.nodeDisabled : ''} ${dimmed ? styles.nodeDimmed : ''}`}
      transform={`translate(${x},${y})`}
      role={onSelect ? 'button' : 'img'}
      aria-pressed={onSelect ? state === 'selected' : undefined}
      aria-label={`${role} · ${nameES}${ariaSelected}`}
      tabIndex={interactive ? 0 : -1}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      onClick={onSelect ? click : undefined}
      onKeyDown={onSelect ? onKey : undefined}
    >
      <circle className={styles.hit} cx={0} cy={0} r={R + 6} fill="transparent" />
      {/* La escala va en un <g> interno: una regla CSS `transform` sobre el <g>
          externo reemplazaría su atributo translate y movería el nodo al origen. */}
      <g className={playing ? styles.nodePulse : undefined}>
        {playing && (
          <circle cx={0} cy={0} r={R + 6} fill="none" stroke="var(--amber)" strokeWidth={3} />
        )}
        <circle cx={0} cy={0} r={R} fill={fill} stroke={stroke} strokeWidth={1.5} />
        {/* Reposo: rol (función) en Plex Mono, que preserva mayús/minús (así 3m≠3M
            y 5d≠5). Activo: glifo de la nota en Bebas, blanco sobre el círculo
            saturado (excepción Signature). */}
        {/* y: la tinta se centra con `dominant-baseline: middle` + un ajuste por
            fuente. Medido en browser: con Bebas 18px la baseline cae 6.3px bajo
            el centro y la ideal es 6.5 (y = 0); con Plex Mono 14px cae 3.61 y la
            ideal es 5 (y = 1). Un solo valor descentra una de las dos. */}
        <text
          className={colored ? styles.nodeGlyph : roleClass}
          x={0}
          y={colored ? 0 : 1}
          fill={colored ? '#fff' : 'var(--text-body)'}
          style={colored && member.spelled.length > 2 ? { fontSize: '13px' } : undefined}
        >
          {colored ? member.spelled : role}
        </text>
      </g>
      <text
        className={
          colored ? `${styles.nodeName} ${major ? styles.roleMajor : styles.roleMinor}` : styles.nodeName
        }
        x={0}
        y={R + 18}
        fill="var(--muted)"
      >
        {colored ? role : nameES}
      </text>
    </g>
  );
}
