import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/useUIStore';
import { getCtx } from '../../hooks/useAudioEngine';
import styles from './MuteToggle.module.css';

export default function MuteToggle() {
  const audioMuted = useUIStore((s) => s.audioMuted);
  const toggleAudioMute = useUIStore((s) => s.toggleAudioMute);
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';

  const labelOn = isDe ? 'Audio einschalten' : 'Activar audio';
  const labelOff = isDe ? 'Audio stummschalten' : 'Silenciar audio';

  // Encender el audio es el gesto de usuario más confiable de la app: crear o
  // reanudar el contexto aquí lo desbloquea en iOS, donde el hover emulado
  // de los nodos no cuenta como gesto.
  const toggleAudioAndUnlockContext = () => {
    if (audioMuted) getCtx();
    toggleAudioMute();
  };

  return (
    <button
      type="button"
      className={styles.wrap}
      onClick={toggleAudioAndUnlockContext}
      aria-label={audioMuted ? labelOn : labelOff}
      aria-pressed={!audioMuted}
    >
      <span className={styles.label}>AUDIO · {audioMuted ? 'OFF' : 'ON'}</span>
      <span className={audioMuted ? styles.toggle : styles.toggleOn} />
    </button>
  );
}
