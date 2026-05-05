import { useState } from 'react';
import NoteSelector from '../../shared/NoteSelector';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { NATURALS, NOTE_COLORS, NOTE_ES } from '../../../data/notes';
import { ROLE_LABELS, ROLE_COLORS } from '../../../data/triads';
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
      <h2 style={{ fontSize: 24 }}>Tríada Maestra (Cadena Infinita de Terceras)</h2>
      <p style={{ marginBottom: 16, fontSize: 12, color: 'var(--muted)' }}>
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
              >
                <div
                  className={styles.chainCircle}
                  style={{
                    background: NOTE_COLORS[note],
                    border: isRoot ? '2px solid #fff' : 'none',
                  }}
                >
                  {note}
                </div>
                <span className={styles.chainLabel}>{NOTE_ES[note]}</span>
                <span className={styles.chainRole} style={{ background: ROLE_COLORS[roleIdx] }}>
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
