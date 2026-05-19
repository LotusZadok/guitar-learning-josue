import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import Prose from '../../../shared/Prose/Prose';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import RelativasMenores from '../../../primitives/RelativasMenores/RelativasMenores';
import { useUIStore } from '../../../../stores/useUIStore';
import type { NoteSpelling } from '../../../../types/music';
import {
  RELATIVAS_INTRO,
  RELATIVAS_PROCESO,
  RELATIVAS_RULE_NOTE,
  RELATIVAS_TABLA_HEADERS,
} from '../data/literalContent';
import styles from './RelativasMenoresSection.module.css';

const TABLA_ROWS: ReadonlyArray<{
  mayor: NoteSpelling;
  menor: NoteSpelling;
  armadura: readonly NoteSpelling[];
}> = [
  { mayor: 'C',  menor: 'A',  armadura: [] },
  { mayor: 'G',  menor: 'E',  armadura: ['F#'] },
  { mayor: 'D',  menor: 'B',  armadura: ['F#', 'C#'] },
  { mayor: 'A',  menor: 'F#', armadura: ['F#', 'C#', 'G#'] },
  { mayor: 'F',  menor: 'D',  armadura: ['Bb'] },
  { mayor: 'Bb', menor: 'G',  armadura: ['Bb', 'Eb'] },
] as const;

export default function RelativasMenoresSection() {
  const tonic = useUIStore((s) => s.tonic);

  return (
    <section className={styles.section}>
      <SectionLabel text="4.9 · Relativas menores" />
      <h2>Relativas menores</h2>

      {RELATIVAS_INTRO.map((seg, i) => (
        <p key={i} className={styles.text}>
          <Prose segment={seg} />
        </p>
      ))}

      <h3 className={styles.subheading}>Proceso rápido</h3>
      <ol className={styles.pasos}>
        {RELATIVAS_PROCESO.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>

      <RelativasMenores tonic={tonic} />

      <div className={styles.tableWrap}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              {RELATIVAS_TABLA_HEADERS.map((h) => (
                <th key={h} scope="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLA_ROWS.map((row) => (
              <tr key={row.mayor}>
                <td><NoteToken note={row.mayor} /> mayor</td>
                <td><NoteToken note={row.menor} />m</td>
                <td>
                  {row.armadura.length === 0
                    ? '(ninguna)'
                    : row.armadura.map((n, i) => (
                        <span key={n}>
                          {i > 0 && ' '}
                          <NoteToken note={n} />
                        </span>
                      ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RuleNote>{RELATIVAS_RULE_NOTE}</RuleNote>
    </section>
  );
}
