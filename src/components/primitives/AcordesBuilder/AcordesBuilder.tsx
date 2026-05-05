import { useCallback, useMemo, useState, type KeyboardEvent } from 'react';
import NoteSelector from '../../shared/NoteSelector';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { ALL, NOTE_COLORS, NOTE_ES } from '../../../data/notes';
import { chordSpelled, type ChordType, type ChordMember } from '../../../utils/noteCalculations';
import type { ChromaticNote } from '../../../types/music';
import styles from './AcordesBuilder.module.css';

const ARPEGGIO_GAP_MS = 250;
const NOTE_DURATION = 1.4;

export default function AcordesBuilder() {
  const [tonic, setTonic] = useState<ChromaticNote>('A');
  const [type, setType] = useState<ChordType>('M');
  const [playing, setPlaying] = useState(false);
  const { playNote } = useAudioEngine();

  const chord = useMemo(() => chordSpelled(tonic, type), [tonic, type]);

  const playMember = useCallback(
    (m: ChordMember) => playNote(m.chromatic, m.octave, NOTE_DURATION),
    [playNote],
  );

  const handlePlayBlock = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    chord.forEach((m) => playMember(m));
    setTimeout(() => setPlaying(false), NOTE_DURATION * 1000);
  }, [chord, playMember, playing]);

  const handlePlayArpeggio = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    chord.forEach((m, i) => setTimeout(() => playMember(m), i * ARPEGGIO_GAP_MS));
    setTimeout(
      () => setPlaying(false),
      chord.length * ARPEGGIO_GAP_MS + NOTE_DURATION * 1000,
    );
  }, [chord, playMember, playing]);

  return (
    <div className={styles.wrap}>
      <NoteSelector
        notes={[...ALL]}
        selected={tonic}
        onSelect={(n) => setTonic(n as ChromaticNote)}
      />

      <div className={styles.qualityRow} role="group" aria-label="Calidad del acorde">
        <button
          className={type === 'M' ? styles.qualityActive : styles.quality}
          onClick={() => setType('M')}
          aria-pressed={type === 'M'}
        >
          Mayor
        </button>
        <button
          className={type === 'm' ? styles.qualityActive : styles.quality}
          onClick={() => setType('m')}
          aria-pressed={type === 'm'}
        >
          Menor
        </button>
      </div>

      <div className={styles.chordRow}>
        {chord.map((m, i) => (
          <ChordNoteCard key={`${m.role}-${i}`} member={m} onPlay={playMember} />
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
}

function ChordNoteCard({ member, onPlay }: ChordNoteCardProps) {
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

  return (
    <div
      className={styles.card}
      tabIndex={0}
      role="button"
      aria-label={`${NOTE_ES[member.chromatic]} · ${member.role}`}
      onMouseEnter={handleEnter}
      onFocus={handleEnter}
      onKeyDown={handleKey}
    >
      <svg className={styles.nodeSvg} viewBox="0 0 80 80" aria-hidden="true">
        <circle
          cx={40}
          cy={40}
          r={28}
          fill={NOTE_COLORS[member.chromatic]}
        />
        <text
          x={40}
          y={42}
          className={styles.nodeLetter}
        >
          {member.spelled}
        </text>
      </svg>
      <div className={styles.cardLabel}>{member.role}</div>
      <div className={styles.cardName}>{NOTE_ES[member.chromatic]}</div>
    </div>
  );
}
