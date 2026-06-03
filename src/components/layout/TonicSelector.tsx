import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/useUIStore';
import { ALL } from '../../data/notes';
import { noteDisplay } from '../../utils/noteCalculations';
import type { ChromaticNote } from '../../types/music';
import styles from './TonicSelector.module.css';

// Show both enharmonic spellings on black keys (e.g. "A♯/B♭") so the selector
// exposes the # ↔ ♭ equivalence explicitly. The method still picks the correct
// spelling per tonality internally (chordSpelled / majorScaleSpelled).
const noteLabel = (n: ChromaticNote) => noteDisplay(n);

export default function TonicSelector() {
  const tonic = useUIStore((s) => s.tonic);
  const setTonic = useUIStore((s) => s.setTonic);
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';

  return (
    <div className={styles.wrap}>
      <label htmlFor="tonic-select" className={styles.label}>
        {isDe ? 'TONART' : 'TÓNICA'}
      </label>
      <select
        id="tonic-select"
        className={styles.select}
        value={tonic}
        onChange={(e) => setTonic(e.target.value as ChromaticNote)}
      >
        {ALL.map((note) => (
          <option key={note} value={note}>
            {noteLabel(note)}
          </option>
        ))}
      </select>
      <span className={styles.hint}>
        {isDe ? 'Transponiert Tonleitern, Akkorde und Stufen' : 'Transpone escalas, acordes y grados'}
      </span>
    </div>
  );
}
