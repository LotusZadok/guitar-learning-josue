import { useTranslation } from 'react-i18next';
import { NOTE_DE } from "../../../data/notes";
import IntervalRow from './IntervalRow';
import { useUIStore } from '../../../stores/useUIStore';
import { noteShort, spelledIntervalFromTonic, spelledNameES, tonicChromatic } from '../../../utils/noteCalculations';
import styles from './Intervals.module.css';


// El primitive usa el validador para mostrar las terceras correctas según la tónica
// (regla letra-única). p.ej. 3m de G es B♭, no A♯.
export default function IntervalsSection() {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const root = useUIStore((s) => s.tonic);

  const t3m = spelledIntervalFromTonic(root, 3, 'm');
  const t3M = spelledIntervalFromTonic(root, 3, 'M');
  const quinta = spelledIntervalFromTonic(root, 5, 'P');
  const rootSpelled = noteShort(root);
  const rootES = spelledNameES(root);
  const rootDE = NOTE_DE[tonicChromatic(root)];

  const intervals = isDe
    ? [
        { name: 'Tonika', st: '0 HT', desc: `Grundton. Ausgangspunkt → ${rootSpelled} (${rootDE})` },
        { name: 'Kleine Terz', st: '3 HT', desc: `${t3m} · definiert den Moll-Akkord` },
        { name: 'Große Terz', st: '4 HT', desc: `${t3M} · definiert den Dur-Akkord` },
        { name: 'Quinte', st: '7 HT', desc: `Reine Quinte → ${quinta}` },
        { name: 'Oktave', st: '12 HT', desc: `Wiederholung der Tonika eine Oktave höher → ${rootSpelled}` },
      ]
    : [
        { name: 'Tónica', st: '0 st', desc: `Nota base. Punto de partida → ${rootSpelled} (${rootES})` },
        { name: '3ra Menor', st: '3 st', desc: `${t3m} · Define acorde menor` },
        { name: '3ra Mayor', st: '4 st', desc: `${t3M} · Define acorde mayor` },
        { name: 'Quinta', st: '7 st', desc: `Quinta justa → ${quinta}` },
        { name: 'Octava', st: '12 st', desc: `Repetición de la tónica, una octava arriba → ${rootSpelled}` },
      ];

  return (
    <div className={styles.wrap}>
      <div className={styles.list}>
        {intervals.map((iv) => (
          <IntervalRow key={iv.name} {...iv} />
        ))}
      </div>
    </div>
  );
}
