import styles from './ToggleSwitch.module.css';

interface ToggleSwitchProps {
  label?: string;
  ariaLabel: string;
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function ToggleSwitch({ label, ariaLabel, on, onToggle, disabled }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      className={styles.wrap}
      onClick={onToggle}
      disabled={disabled}
    >
      {label && <span className={styles.label}>{label}</span>}
      <span className={on ? styles.toggleOn : styles.toggle} />
    </button>
  );
}
