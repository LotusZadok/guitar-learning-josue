import { useUIStore } from '../../stores/useUIStore';
import styles from './MuteToggle.module.css';

export default function MuteToggle() {
  const audioMuted = useUIStore((s) => s.audioMuted);
  const toggleAudioMute = useUIStore((s) => s.toggleAudioMute);

  return (
    <button
      type="button"
      className={styles.wrap}
      onClick={toggleAudioMute}
      aria-label={audioMuted ? 'Activar audio' : 'Silenciar audio'}
      aria-pressed={!audioMuted}
    >
      <span className={styles.label}>AUDIO · {audioMuted ? 'OFF' : 'ON'}</span>
      <span className={audioMuted ? styles.toggle : styles.toggleOn} />
    </button>
  );
}
