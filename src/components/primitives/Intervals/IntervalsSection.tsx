import { useState } from 'react';
import SectionLabel from '../../shared/SectionLabel';
import NoteSelector from '../../shared/NoteSelector';
import IntervalRow from './IntervalRow';
import IntervalMiniFretboard from './IntervalMiniFretboard';
import { NATURALS, ALL, NOTE_ES } from '../../../data/notes';
import { noteShort } from '../../../utils/noteCalculations';
import type { NaturalNote } from '../../../types/music';
import styles from './Intervals.module.css';

export default function IntervalsSection() {
  const [root, setRoot] = useState<NaturalNote>('G');
  const ri = ALL.indexOf(root);
  const t3m = ALL[(ri + 3) % 12];
  const t3M = ALL[(ri + 4) % 12];
  const quinta = ALL[(ri + 7) % 12];

  const intervals = [
    { name: 'Tónica', st: '0 st', desc: `Nota base. Punto de partida → ${root}`, color: 'var(--red)' },
    { name: '3ra Menor', st: '3 st', desc: `${noteShort(t3m)} (${NOTE_ES[t3m]}) — Define acorde menor`, color: '#2980b9' },
    { name: '3ra Mayor', st: '4 st', desc: `${noteShort(t3M)} (${NOTE_ES[t3M]}) — Define acorde mayor`, color: '#27ae60' },
    { name: 'Quinta', st: '7 st', desc: `Quinta justa → ${quinta} (${NOTE_ES[quinta]})`, color: 'var(--amber)' },
    { name: 'Octava', st: '12 st', desc: `Repetición de la tónica, una octava arriba → ${root}`, color: 'var(--string6)' },
  ];

  return (
    <div className={styles.section}>
      <SectionLabel text="05 — Intervalos" />
      <h2>Patrón Interválico</h2>
      <NoteSelector
        notes={[...NATURALS]}
        selected={root}
        onSelect={(n) => setRoot(n as NaturalNote)}
      />
      <div className={styles.list}>
        {intervals.map((iv) => (
          <IntervalRow key={iv.name} {...iv} />
        ))}
      </div>
      <IntervalMiniFretboard root={root} />
    </div>
  );
}
