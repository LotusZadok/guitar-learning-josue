import { useCallback, useMemo, useState, type KeyboardEvent } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { NOTE_COLORS } from '../../../data/notes';
import { chordSpelled, ensureAscending, type ChordType, type ChordMember } from '../../../utils/noteCalculations';
import styles from './AcordesBuilder.module.css';

// Reunión 24/5/26: el "Nombre en latino" debe derivarse del spelled (no del chromatic),
// para que coincida con el círculo del nodo. Mapea letra+alteración glifo → nombre ES.
const LETTER_ES: Record<string, string> = {
  C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si',
};
function spelledES(spelled: string): string {
  const letter = spelled[0];
  const acc = spelled.slice(1);
  return (LETTER_ES[letter] ?? letter) + acc;
}

const ARPEGGIO_GAP_MS = 250;
const NOTE_DURATION = 1.4;

export default function AcordesBuilder() {
  const tonic = useUIStore((s) => s.tonic);
  const [type, setType] = useState<ChordType>('M');
  const [playing, setPlaying] = useState(false);
  // null = idle; -1 = all (bloque); 0..n = arpeggio index in chord order
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const { playNote } = useAudioEngine();

  const chord = useMemo(() => chordSpelled(tonic, type), [tonic, type]);

  const playMember = useCallback(
    (m: ChordMember) => playNote(m.chromatic, m.octave, NOTE_DURATION),
    [playNote],
  );

  const handlePlayBlock = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    setPlayingIdx(-1); // all cards active simultaneously
    chord.forEach((m) => playMember(m));
    setTimeout(() => { setPlaying(false); setPlayingIdx(null); }, NOTE_DURATION * 1000);
  }, [chord, playMember, playing]);

  const handlePlayArpeggio = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    const ascending = ensureAscending(chord);
    ascending.forEach((m, i) => {
      setTimeout(() => {
        playMember(m);
        setPlayingIdx(i);
      }, i * ARPEGGIO_GAP_MS);
    });
    setTimeout(
      () => { setPlaying(false); setPlayingIdx(null); },
      chord.length * ARPEGGIO_GAP_MS + NOTE_DURATION * 1000,
    );
  }, [chord, playMember, playing]);

  return (
    <div className={styles.wrap}>
      <div className={styles.qualityRow} role="group" aria-label="Calidad del acorde">
        {/* Reunión 24/5/26: removido el aumentado del constructor. */}
        {([ ['M', 'Mayor'], ['m', 'Menor'], ['dim', 'Dis.'] ] as const).map(
          ([t, label]) => (
            <button
              key={t}
              className={type === t ? styles.qualityActive : styles.quality}
              onClick={() => setType(t)}
              aria-pressed={type === t}
            >
              {label}
            </button>
          ),
        )}
      </div>

      <div className={styles.chordRow}>
        {chord.map((m, i) => (
          <ChordNoteCard
            key={`${m.role}-${i}`}
            member={m}
            onPlay={playMember}
            isPlaying={playingIdx === -1 || playingIdx === i}
            isDimmed={playingIdx !== null && playingIdx !== -1 && playingIdx !== i}
          />
        ))}
      </div>

      <div className={styles.audioRow}>
        <button
          className={styles.audioBtn}
          onClick={handlePlayBlock}
          disabled={playing}
        >
          Bloque
        </button>
        <button
          className={styles.audioBtn}
          onClick={handlePlayArpeggio}
          disabled={playing}
        >
          Arpegiado
        </button>
      </div>
    </div>
  );
}

interface ChordNoteCardProps {
  member: ChordMember;
  onPlay: (m: ChordMember) => void;
  isPlaying?: boolean;
  isDimmed?: boolean;
}

// Reunión 24/5/26: el label debajo del nodo es invariante a la calidad.
// T = tónica, 3 = tercera (sea M o m), 5 = quinta (sea J o d).
const ROLE_DISPLAY: Record<ChordMember['role'], string> = {
  T: 'T',
  '3M': '3',
  '3m': '3',
  '5J': '5',
  '5aug': '5',
  '5dim': '5',
};

function ChordNoteCard({ member, onPlay, isPlaying, isDimmed }: ChordNoteCardProps) {
  const [hovered, setHovered] = useState(false);
  const handleEnter = useCallback(() => { setHovered(true); onPlay(member); }, [member, onPlay]);
  const handleLeave = useCallback(() => setHovered(false), []);
  const handleKey = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPlay(member);
      }
    },
    [member, onPlay],
  );

  let cardClass = styles.card;
  if (isPlaying) cardClass = `${styles.card} ${styles.cardPlaying}`;
  else if (isDimmed) cardClass = `${styles.card} ${styles.cardDimmed}`;

  const roleLabel = ROLE_DISPLAY[member.role];
  // Reduce font when spelled has 3+ chars (e.g. "B♭♭", "F♭♭")
  const spelledStyle = member.spelled.length > 2 ? { fontSize: '15px' } : undefined;
  const showColor = hovered || isPlaying;
  // El nombre en español deriva del spelled (B♭ → Si♭), no del chromatic (A# → La♯).
  const nameES = spelledES(member.spelled);

  return (
    <div
      className={cardClass}
      tabIndex={0}
      role="button"
      aria-label={`${nameES} · ${roleLabel}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      onKeyDown={handleKey}
    >
      <svg className={styles.nodeSvg} viewBox="0 0 80 80" aria-hidden="true">
        {/* Monocromo en reposo, color en hover/playing. */}
        <circle
          cx={40} cy={40} r={28}
          fill={showColor ? NOTE_COLORS[member.chromatic] : 'var(--surface)'}
          stroke={showColor ? 'none' : 'var(--rule)'}
          strokeWidth={1}
        />
        {isPlaying && (
          <circle cx={40} cy={40} r={33} fill="none" stroke="var(--amber)" strokeWidth={2} />
        )}
        <text
          x={40} y={42}
          className={styles.nodeLetter}
          style={spelledStyle}
          fill={showColor ? '#fff' : 'var(--text-body)'}
        >
          {member.spelled}
        </text>
      </svg>
      <div className={styles.cardLabel}>{roleLabel}</div>
      <div className={styles.cardName}>{nameES}</div>
    </div>
  );
}
