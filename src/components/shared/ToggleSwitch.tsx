import styles from './ToggleSwitch.module.css';

interface ToggleSwitchProps {
  label: string;
  on: boolean;
  onToggle: () => void;
}

export default function ToggleSwitch({ label, on, onToggle }: ToggleSwitchProps) {
  return (
    <div className={styles.wrap} onClick={onToggle}>
      <span className={styles.label}>{label}</span>
      <div className={on ? styles.toggleOn : styles.toggle} />
    </div>
  );
}
