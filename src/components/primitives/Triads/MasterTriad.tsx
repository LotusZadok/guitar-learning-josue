import { useState } from 'react';
import NoteSelector from '../../shared/NoteSelector';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { NATURALS, NOTE_COLORS, NOTE_ES } from '../../../data/notes';
import { ROLE_LABELS } from '../../../data/triads';
import type { NaturalNote } from '../../../types/music';
import styles from './Triads.module.css';

const CYCLES = 3;

export default function MasterTriad() {
  const [root, setRoot] = useState<NaturalNote>('A');
  const { playNote } = useAudioEngine();

  const startIdx = NATURALS.indexOf(root);
  const totalNotes = 7 * CYCLES;

  return (
    <div className={styles.masterWrap}>
      <h3 className={styles.masterTitle}>Tríada Maestra (Cadena Infinita de Terceras)</h3>
      <p className={styles.masterIntro}>
        Seleccioná una nota raíz. La cadena apila terceras diatónicas en ciclo:
        T → 3ra → 5ta → 7ma → 9na → 11na → 13na → repite.
      </p>
      <NoteSelector
        notes={[...NATURALS]}
        selected={root}
        onSelect={(n) => setRoot(n as NaturalNote)}
      />
      <div className={styles.chain}>
        {Array.from({ length: totalNotes }, (_, i) => {
          const ni = (startIdx + i) % 7;
          const note = NATURALS[ni];
          const roleIdx = i % 7;
          const isRoot = note === root;
          return (
            <span key={i} style={{ display: 'contents' }}>
              {i > 0 && <span className={styles.chainArrow}>→</span>}
              <div
                className={styles.chainNote}
                onMouseEnter={() => playNote(note, 4, 2)}
                onClick={() => playNote(note, 4, 2)}
                tabIndex={0}
                role="button"
                aria-label={`Nota ${NOTE_ES[note]} en posición ${ROLE_LABELS[roleIdx]}`}
                onFocus={() => playNote(note, 4, 2)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    playNote(note, 4, 2);
                  }
                }}
              >
                <div
                  className={styles.chainCircle}
                  style={{
                    background: NOTE_COLORS[note],
                    border: isRoot ? '2px solid var(--paper)' : 'none',
                  }}
                >
                  {note}
                </div>
                <span className={styles.chainLabel}>{NOTE_ES[note]}</span>
                <span className={`${styles.chainRole} ${roleIdx === 0 ? styles.chainRoleTonic : ''}`}>
                  {ROLE_LABELS[roleIdx]}
                </span>
              </div>
            </span>
          );
        })}
        <span className={styles.chainArrow} style={{ opacity: 0.5, fontSize: 16 }}>→ ∞</span>
      </div>
    </div>
  );
}
