import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ChromaticNode from './ChromaticNode';
import { ALL } from '../../../data/notes';
import { chordSpelled, ensureAscending } from '../../../utils/noteCalculations';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import type { ChromaticNote } from '../../../types/music';
import styles from './ChromaticCircle.module.css';

const CX = 200, CY = 200, R = 140;
const ARPEGGIO_GAP_MS = 200;
const NOTE_DURATION = 2.0;

type PlayMode = 'arpegio' | 'bloque';

export default function ChromaticCircleSection() {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const [playMode, setPlayMode] = useState<PlayMode>('arpegio');
  const { playNote } = useAudioEngine();

  const makePlayFn = useCallback(
    (note: ChromaticNote) => () => {
      const members = chordSpelled(note, 'M');
      if (playMode === 'bloque') {
        members.forEach((m) => playNote(m.chromatic, m.octave, NOTE_DURATION));
      } else {
        const ascending = ensureAscending(members);
        ascending.forEach((m, i) =>
          setTimeout(() => playNote(m.chromatic, m.octave, NOTE_DURATION), i * ARPEGGIO_GAP_MS),
        );
      }
    },
    [playMode, playNote],
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.playToggleRow}>
        <span className={styles.toggleLabel}>{isDe ? 'Wiedergabe:' : 'Reproducción:'}</span>
        {(['arpegio', 'bloque'] as PlayMode[]).map((m) => (
          <button
            key={m}
            className={playMode === m ? styles.playToggleActive : styles.playToggle}
            onClick={() => setPlayMode(m)}
            aria-pressed={playMode === m}
          >
            {isDe
              ? (m === 'arpegio' ? 'Arpeggio' : 'Block')
              : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>
      <svg className={styles.svg} viewBox="0 0 400 400">
        <circle cx={CX} cy={CY} r={R + 16} fill="none" style={{ stroke: 'var(--rule)' }} strokeWidth={0.5} />
        {(isDe ? ['Chromatischer', 'Kreis'] : ['Círculo', 'Cromático']).map((t, i) => (
          <text key={t} x={CX} y={CY - 8 + i * 18} textAnchor="middle" style={{ fill: 'var(--muted)' }} fontSize={11}>
            {t}
          </text>
        ))}
        {ALL.map((note, i) => (
          <ChromaticNode
            key={note}
            note={note}
            index={i}
            cx={CX} cy={CY} r={R}
            onPlay={makePlayFn(note)}
          />
        ))}
      </svg>
    </div>
  );
}
