import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import NoteSelector from '../../shared/NoteSelector';
import IntervalRow from './IntervalRow';
import { NATURALS, ALL, NOTE_ES } from '../../../data/notes';
import { noteShort } from '../../../utils/noteCalculations';
import type { NaturalNote } from '../../../types/music';
import styles from './Intervals.module.css';

const NOTE_DE_LETTER: Record<string, string> = {
  C: 'C', 'C#': 'Cis', D: 'D', 'D#': 'Dis', E: 'E', F: 'F',
  'F#': 'Fis', G: 'G', 'G#': 'Gis', A: 'A', 'A#': 'B', B: 'H',
};

export default function IntervalsSection() {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const [root, setRoot] = useState<NaturalNote>('G');
  const ri = ALL.indexOf(root);
  const t3m = ALL[(ri + 3) % 12];
  const t3M = ALL[(ri + 4) % 12];
  const quinta = ALL[(ri + 7) % 12];

  const intervals = isDe
    ? [
        { name: 'Tonika', st: '0 HT', desc: `Grundton. Ausgangspunkt → ${root}` },
        { name: 'Kleine Terz', st: '3 HT', desc: `${noteShort(t3m)} (${NOTE_DE_LETTER[t3m] ?? t3m}) · definiert den Moll-Akkord` },
        { name: 'Große Terz', st: '4 HT', desc: `${noteShort(t3M)} (${NOTE_DE_LETTER[t3M] ?? t3M}) · definiert den Dur-Akkord` },
        { name: 'Quinte', st: '7 HT', desc: `Reine Quinte → ${quinta} (${NOTE_DE_LETTER[quinta] ?? quinta})` },
        { name: 'Oktave', st: '12 HT', desc: `Wiederholung der Tonika eine Oktave höher → ${root}` },
      ]
    : [
        { name: 'Tónica', st: '0 st', desc: `Nota base. Punto de partida → ${root}` },
        { name: '3ra Menor', st: '3 st', desc: `${noteShort(t3m)} (${NOTE_ES[t3m]}) · Define acorde menor` },
        { name: '3ra Mayor', st: '4 st', desc: `${noteShort(t3M)} (${NOTE_ES[t3M]}) · Define acorde mayor` },
        { name: 'Quinta', st: '7 st', desc: `Quinta justa → ${quinta} (${NOTE_ES[quinta]})` },
        { name: 'Octava', st: '12 st', desc: `Repetición de la tónica, una octava arriba → ${root}` },
      ];

  return (
    <div className={styles.wrap}>
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
    </div>
  );
}
