import { useRef, useState, useEffect } from 'react';
import styles from './ScaleDisplay.module.css';

interface Props {
  notes: string[];
  label?: string;
}

function NoteSlot({ note }: { note: string }) {
  const prevRef = useRef(note);
  const [animating, setAnimating] = useState(false);
  const prevNote = prevRef.current;

  useEffect(() => {
    if (note !== prevRef.current) {
      setAnimating(true);
      const t = setTimeout(() => {
        prevRef.current = note;
        setAnimating(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [note]);

  const showCrossfade = animating && prevNote !== note;

  return (
    <div className={styles.slot}>
      {showCrossfade && <span className={styles.fadeOut}>{prevNote}</span>}
      <span className={showCrossfade ? styles.fadeIn : styles.note}>{note}</span>
    </div>
  );
}

export default function ScaleDisplay({ notes, label }: Props) {
  if (notes.length === 0) return null;

  return (
    <div className={styles.wrap}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.row}>
        {notes.map((n, i) => (
          <NoteSlot key={i} note={n} />
        ))}
      </div>
    </div>
  );
}
