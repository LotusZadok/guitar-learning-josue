import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import Prose from '../../../shared/Prose/Prose';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import RelativasMenores from '../../../primitives/RelativasMenores/RelativasMenores';
import { useUIStore } from '../../../../stores/useUIStore';
import type { NoteSpelling } from '../../../../types/music';
import {
  RELATIVAS_INTRO,
  RELATIVAS_INTRO_DE,
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
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const tonic = useUIStore((s) => s.tonic);

  const intro = locale === 'de' ? RELATIVAS_INTRO_DE : RELATIVAS_INTRO;
  const process = t('t2.s49.process', { returnObjects: true }) as string[];

  return (
    <section className={styles.section}>
      <SectionLabel text={t('t2.s49.label')} />
      <h2>{t('t2.s49.title')}</h2>

      {intro.map((seg, i) => (
        <p key={i} className={styles.text}>
          <Prose segment={seg} />
        </p>
      ))}

      <h3 className={styles.subheading}>{t('t2.s49.process_title')}</h3>
      <ol className={styles.pasos}>
        {process.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>

      <RelativasMenores tonic={tonic} />

      <div className={styles.tableWrap}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th scope="col">{t('t2.s49.table_headers.major')}</th>
              <th scope="col">{t('t2.s49.table_headers.minor')}</th>
              <th scope="col">{t('t2.s49.table_headers.key_signature')}</th>
            </tr>
          </thead>
          <tbody>
            {TABLA_ROWS.map((row) => (
              <tr key={row.mayor}>
                <td><NoteToken note={row.mayor} /> {t('common.major')}</td>
                <td><NoteToken note={row.menor} />m</td>
                <td>
                  {row.armadura.length === 0
                    ? t('t2.s49.table_no_sharps_flats')
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

      <RuleNote>{t('t2.s49.tip')}</RuleNote>
    </section>
  );
}
