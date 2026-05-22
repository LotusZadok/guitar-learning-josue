import { useCallback, useMemo, useState, type KeyboardEvent } from 'react';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { NOTE_COLORS, NOTE_ES } from '../../../data/notes';
import { chordSpelled, ensureAscending, type ChordType, type ChordMember } from '../../../utils/noteCalculations';
import styles from './AcordesBuilder.module.css';

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
        {([ ['M', 'Mayor'], ['m', 'Menor'], ['aug', 'Aum.'], ['dim', 'Dis.'] ] as const).map(
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

const ROLE_DISPLAY: Partial<Record<ChordMember['role'], string>> = {
  '5aug': '5+',
  '5dim': '5°',
};

function ChordNoteCard({ member, onPlay, isPlaying, isDimmed }: ChordNoteCardProps) {
  const handleEnter = useCallback(() => onPlay(member), [member, onPlay]);
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

  const roleLabel = ROLE_DISPLAY[member.role] ?? member.role;
  // Reduce font when spelled has 3+ chars (e.g. "B♭♭", "F♭♭")
  const spelledStyle = member.spelled.length > 2 ? { fontSize: '15px' } : undefined;

  return (
    <div
      className={cardClass}
      tabIndex={0}
      role="button"
      aria-label={`${NOTE_ES[member.chromatic]} · ${roleLabel}`}
      onMouseEnter={handleEnter}
      onFocus={handleEnter}
      onKeyDown={handleKey}
    >
      <svg className={styles.nodeSvg} viewBox="0 0 80 80" aria-hidden="true">
        <circle cx={40} cy={40} r={28} fill={NOTE_COLORS[member.chromatic]} />
        {isPlaying && (
          <circle cx={40} cy={40} r={33} fill="none" stroke="var(--amber)" strokeWidth={2} />
        )}
        <text x={40} y={42} className={styles.nodeLetter} style={spelledStyle}>
          {member.spelled}
        </text>
      </svg>
      <div className={styles.cardLabel}>{roleLabel}</div>
      <div className={styles.cardName}>{NOTE_ES[member.chromatic]}</div>
    </div>
  );
}
