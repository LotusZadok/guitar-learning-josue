import { useTranslation } from 'react-i18next';
import { useAudioEngine } from '../../../hooks/useAudioEngine';
import { useUIStore } from '../../../stores/useUIStore';
import { NATURALS, NOTE_COLORS, NOTE_ES } from '../../../data/notes';
import { ROLE_LABELS } from '../../../data/triads';
import type { NaturalNote } from '../../../types/music';
import styles from './Triads.module.css';

const CYCLES = 1;

const NOTE_DE: Record<NaturalNote, string> = {
  C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', A: 'A', B: 'H',
};

// La tónica global puede ser alterada; la cadena maestra trabaja con letras naturales.
// Tomamos la letra de la tónica activa (descartando alteración) como raíz pedagógica.
function naturalFromTonic(tonic: string): NaturalNote {
  return tonic[0] as NaturalNote;
}

export default function MasterTriad() {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const tonic = useUIStore((s) => s.tonic);
  const root = naturalFromTonic(tonic);
  const { playNote } = useAudioEngine();

  const startIdx = NATURALS.indexOf(root);
  const totalNotes = 7 * CYCLES;

  return (
    <div className={styles.masterWrap}>
      <h3 className={styles.masterTitle}>
        {isDe
          ? 'Meisterdreiklang (Unendliche Terzkette)'
          : 'Tríada Maestra (Cadena Infinita de Terceras)'}
      </h3>
      <p className={styles.masterIntro}>
        {isDe
          ? 'Wähle einen Grundton. Die Kette stapelt diatonische Terzen im Kreis: T → 3 → 5 → 7 → 9 → 11 → 13 → wiederholt.'
          : 'Seleccioná una nota raíz. La cadena apila terceras diatónicas en ciclo: T → 3ra → 5ta → 7ma → 9na → 11na → 13na → repite.'}
      </p>
      <div className={styles.chain}>
        {Array.from({ length: totalNotes }, (_, i) => {
          const ni = (startIdx + i * 2) % 7;
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
                aria-label={isDe ? `Ton ${NOTE_DE[note]} in Position ${ROLE_LABELS[roleIdx]}` : `Nota ${NOTE_ES[note]} en posición ${ROLE_LABELS[roleIdx]}`}
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
                <span className={styles.chainLabel}>{isDe ? NOTE_DE[note] : NOTE_ES[note]}</span>
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
