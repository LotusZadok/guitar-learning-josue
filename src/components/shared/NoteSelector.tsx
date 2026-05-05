import { noteShort } from '../../utils/noteCalculations';
import styles from './NoteSelector.module.css';

interface NoteSelectorProps {
  notes: string[];
  selected: string;
  onSelect: (note: string) => void;
}

export default function NoteSelector({ notes, selected, onSelect }: NoteSelectorProps) {
  return (
    <div className={styles.selector}>
      {notes.map((n) => (
        <button
          key={n}
          className={n === selected ? styles.btnActive : styles.btn}
          onClick={() => onSelect(n)}
          aria-pressed={n === selected}
        >
          {noteShort(n)}
        </button>
      ))}
    </div>
  );
}
