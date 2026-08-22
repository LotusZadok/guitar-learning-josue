import { useState, useEffect } from 'react';
import styles from './ScaleDisplay.module.css';

interface Props {
  notes: string[];
  label?: string;
}

// La nota saliente vive en estado, no en un ref leído durante el render: el
// ref hacía que el crossfade dependiera de un valor que React no rastrea
// (react-hooks/refs). Con estado, "hay crossfade" es simplemente prev !== note,
// y el `animating` separado sobra.
function NoteSlot({ note }: { note: string }) {
  const [prev, setPrev] = useState(note);

  useEffect(() => {
    if (note === prev) return;
    const t = setTimeout(() => setPrev(note), 300);
    return () => clearTimeout(t);
  }, [note, prev]);

  const showCrossfade = prev !== note;

  return (
    <div className={styles.slot}>
      {showCrossfade && <span className={styles.fadeOut}>{prev}</span>}
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
