import styles from './Intervals.module.css';

interface IntervalRowProps {
  name: string;
  st: string;
  desc: string;
}

export default function IntervalRow({ name, st, desc }: IntervalRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.name}>{name}</div>
      <div className={styles.semitones}>{st}</div>
      <div className={styles.desc} dangerouslySetInnerHTML={{ __html: desc }} />
    </div>
  );
}
