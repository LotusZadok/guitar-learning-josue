import { useTranslation } from 'react-i18next';
import styles from './PlaybackButton.module.css';

export type PlayMode = 'bloque' | 'arpegio';

// Etiquetas estándar en toda la app (antes divergían: Arpegio/Arpegiado/Arpeggio).
const LABELS: Record<string, Record<PlayMode, string>> = {
  es: { bloque: 'Bloque', arpegio: 'Arpegio' },
  de: { bloque: 'Block', arpegio: 'Arpeggio' },
};

interface Props {
  mode: PlayMode;
  onClick: () => void;
  /** Si se pasa, el botón es un toggle de modo (aria-pressed). Si no, es acción. */
  pressed?: boolean;
  /** Resaltado mientras suena. */
  playing?: boolean;
  disabled?: boolean;
}

// Botón de reproducción icono-only: solo se ve el glifo de notación; la etiqueta
// explicativa aparece en hover/focus (tooltip, sin layout shift). El nombre del
// modo siempre está disponible para lectores de pantalla vía aria-label.
export default function PlaybackButton({ mode, onClick, pressed, playing, disabled }: Props) {
  const { i18n } = useTranslation();
  const label = (LABELS[i18n.language] ?? LABELS.es)[mode];
  const isToggle = pressed !== undefined;

  let cls = styles.btn;
  if (pressed) cls = `${styles.btn} ${styles.active}`;
  if (playing) cls = `${cls} ${styles.playing}`;

  return (
    <button
      type="button"
      className={cls}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={isToggle ? pressed : undefined}
    >
      {mode === 'bloque' ? <BlockGlyph /> : <ArpeggioGlyph />}
      <span className={styles.tip} aria-hidden="true">
        {label}
      </span>
    </button>
  );
}

// === Glifos de notación musical ===
// Bloque: noteheads apiladas (sonido simultáneo). Arpegio: las mismas noteheads
// con la línea ondulada vertical y la flecha ascendente de la notación estándar.
export function BlockGlyph() {
  return (
    <svg className={styles.glyph} viewBox="0 0 28 44" aria-hidden="true">
      <path className={styles.glyphStroke} d="M2,4 L2,40 M2,4 L8,4 M2,40 L8,40" />
      <ellipse className={styles.glyphFill} cx="18" cy="10" rx="7" ry="5" transform="rotate(-20 18 10)" />
      <ellipse className={styles.glyphFill} cx="18" cy="22" rx="7" ry="5" transform="rotate(-20 18 22)" />
      <ellipse className={styles.glyphFill} cx="18" cy="34" rx="7" ry="5" transform="rotate(-20 18 34)" />
    </svg>
  );
}

export function ArpeggioGlyph() {
  return (
    <svg className={styles.glyph} viewBox="0 0 28 44" aria-hidden="true">
      <path className={styles.glyphStroke} d="M4,40 q-6,-6 0,-12 q6,-6 0,-12 q-6,-6 0,-12" />
      <path className={styles.glyphFill} d="M4,4 l-3,6 l6,0 z" />
      <ellipse className={styles.glyphFill} cx="18" cy="10" rx="7" ry="5" transform="rotate(-20 18 10)" />
      <ellipse className={styles.glyphFill} cx="18" cy="22" rx="7" ry="5" transform="rotate(-20 18 22)" />
      <ellipse className={styles.glyphFill} cx="18" cy="34" rx="7" ry="5" transform="rotate(-20 18 34)" />
    </svg>
  );
}
