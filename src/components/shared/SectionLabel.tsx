import styles from './SectionLabel.module.css';

interface SectionLabelProps {
  text: string;
}

export default function SectionLabel({ text }: SectionLabelProps) {
  return <div className={styles.label}>{text}</div>;
}
