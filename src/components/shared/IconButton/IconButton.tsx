import type { ReactNode } from 'react';
import styles from './IconButton.module.css';

interface Props {
  /** aria-label y tooltip: el glifo solo no alcanza para quien no lo conoce. */
  label: string;
  onClick: () => void;
  /** Si se pasa, es un toggle (aria-pressed). */
  pressed?: boolean;
  /** Ámbar mientras suena (Amber-Means-Sounding). */
  playing?: boolean;
  children: ReactNode;
}

// Botón icono-only con la misma piel y el mismo tooltip que PlaybackButton
// (DESIGN.md §5 "Playback Buttons"): glifo visible, etiqueta en hover/focus.
export default function IconButton({ label, onClick, pressed, playing, children }: Props) {
  let cls = styles.btn;
  if (pressed) cls = `${cls} ${styles.active}`;
  if (playing) cls = `${cls} ${styles.playing}`;
  return (
    <button
      type="button"
      className={cls}
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
    >
      {children}
      <span className={styles.tip} aria-hidden="true">
        {label}
      </span>
    </button>
  );
}
