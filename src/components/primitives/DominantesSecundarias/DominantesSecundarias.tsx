import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useChordPlayer } from '../../../hooks/useChordPlayer';
import { useUIStore } from '../../../stores/useUIStore';
import { formatChordSymbol, secondaryDominants } from '../../../utils/noteCalculations';
import styles from './DominantesSecundarias.module.css';

const NOTE_DURATION = 1.3;
const ARPEGGIO_GAP_MS = 130;
const CHORD_GAP_MS = 700;

// §3.8 · Las 5 dominantes secundarias (V/x → grado tonizado). Cada tarjeta reproduce
// la dominante y su resolución al grado, mostrando que cualquier grado puede
// tratarse como una tónica temporal. Datos vía Tonal.js (secondaryDominants).
export default function DominantesSecundarias() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const tonic = useUIStore((s) => s.tonic);
  const { playChord, at, clear } = useChordPlayer(NOTE_DURATION);
  const [active, setActive] = useState<number | null>(null);
  const rows = useMemo(() => secondaryDominants(tonic), [tonic]);

  const playRow = useCallback(
    (idx: number) => {
      if (active !== null) return;
      setActive(idx);
      clear();
      playChord(rows[idx].dom.members, ARPEGGIO_GAP_MS);
      playChord(rows[idx].target.members, ARPEGGIO_GAP_MS, CHORD_GAP_MS);
      at(() => setActive(null), CHORD_GAP_MS + NOTE_DURATION * 1000);
    },
    [active, playChord, at, clear, rows],
  );

  return (
    <ul className={styles.list}>
      {rows.map((r, i) => (
        <li key={r.notation}>
          <button
            type="button"
            className={`${styles.row} ${active === i ? styles.rowActive : ''}`}
            onClick={() => playRow(i)}
            disabled={active !== null}
            aria-label={`${t('common.resolves_to', { from: formatChordSymbol(r.dom.cifrado, lang), to: formatChordSymbol(r.target.cifrado, lang) })} (${r.notation})`}
          >
            <span className={styles.target}>{formatChordSymbol(r.target.cifrado, lang)}</span>
            <span className={styles.arrow} aria-hidden="true">↑</span>
            <span className={styles.dom}>{formatChordSymbol(r.dom.cifrado, lang)}</span>
            <span className={styles.notation}>{r.notation}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
