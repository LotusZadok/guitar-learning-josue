import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/useUIStore';
import { setMasterVolume } from '../../hooks/useAudioEngine';
import styles from './DynamicsSelector.module.css';

// Reemplaza el slider de volumen por dinámicas musicales (idea del profesor):
// pp · p · mp · mf · f · ff, cada una mapeada a una ganancia del master gain.
// El default histórico (0.8) cae en "f", así que el arranque no cambia.
interface Dynamic {
  id: string;
  gain: number;
  name: string; // término italiano (universal), usado como aria-label
}

const DYNAMICS: Dynamic[] = [
  { id: 'pp', gain: 0.12, name: 'pianissimo' },
  { id: 'p', gain: 0.28, name: 'piano' },
  { id: 'mp', gain: 0.45, name: 'mezzo piano' },
  { id: 'mf', gain: 0.62, name: 'mezzo forte' },
  { id: 'f', gain: 0.8, name: 'forte' },
  { id: 'ff', gain: 1.0, name: 'fortissimo' },
];

// La dinámica activa es el preset más cercano al volumen actual (tolera el
// default 0.8 y cualquier valor heredado de la versión con slider).
function activeIndex(volume: number): number {
  let best = 0;
  let bestDist = Infinity;
  DYNAMICS.forEach((d, i) => {
    const dist = Math.abs(d.gain - volume);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  });
  return best;
}

export default function DynamicsSelector() {
  const volume = useUIStore((s) => s.volume);
  const setVolume = useUIStore((s) => s.setVolume);
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const active = activeIndex(volume);

  const pick = (d: Dynamic) => {
    setVolume(d.gain);
    setMasterVolume(d.gain);
  };

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{isDe ? 'DYNAMIK' : 'DINÁMICA'}</span>
      <div className={styles.row} role="group" aria-label={isDe ? 'Dynamik' : 'Dinámica'}>
        {DYNAMICS.map((d, i) => (
          <button
            key={d.id}
            type="button"
            className={i === active ? styles.dynActive : styles.dyn}
            onClick={() => pick(d)}
            aria-pressed={i === active}
            aria-label={d.name}
          >
            {d.id}
          </button>
        ))}
      </div>
    </div>
  );
}
