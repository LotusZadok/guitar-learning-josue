import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/useUIStore';
import styles from './MuteToggle.module.css';

export default function MuteToggle() {
  const audioMuted = useUIStore((s) => s.audioMuted);
  const toggleAudioMute = useUIStore((s) => s.toggleAudioMute);
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';

  const labelOn = isDe ? 'Audio einschalten' : 'Activar audio';
  const labelOff = isDe ? 'Audio stummschalten' : 'Silenciar audio';

  return (
    <button
      type="button"
      className={styles.wrap}
      onClick={toggleAudioMute}
      aria-label={audioMuted ? labelOn : labelOff}
      aria-pressed={!audioMuted}
    >
      <span className={styles.label}>AUDIO · {audioMuted ? 'OFF' : 'ON'}</span>
      <span className={audioMuted ? styles.toggle : styles.toggleOn} />
    </button>
  );
}
