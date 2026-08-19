import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import ChordStacks, { type ChordDef } from '../../../primitives/ChordStacks/ChordStacks';
import AcordesBuilder from '../../../primitives/AcordesBuilder/AcordesBuilder';
import { BUILDER_312 } from '../../../primitives/AcordesBuilder/configs';
import styles from './SeptimaAcordesSection.module.css';

// 3.1.2 · Acordes con séptimas (maj7, m7, 7). Fórmulas del source of truth de T3.
const ROWS = [
  { formula: 'T + 3M + 5J + 7M', code: 'maj7' },
  { formula: 'T + 3m + 5J + 7m', code: 'm7' },
  { formula: 'T + 3M + 5J + 7m', code: '7' },
] as const;

// La 3ª y la 7ª son los tonos que cambian entre los tres acordes (se resaltan).
const CHORDS: ChordDef[] = [
  {
    suffix: 'maj7',
    tones: [
      { role: '7', number: 7, quality: 'M', moves: true },
      { role: '5', number: 5, quality: 'P' },
      { role: '3', number: 3, quality: 'M', moves: true },
      { role: 'T', number: 1, quality: 'P' },
    ],
  },
  {
    suffix: 'm7',
    tones: [
      { role: '7', number: 7, quality: 'm', moves: true },
      { role: '5', number: 5, quality: 'P' },
      { role: '3', number: 3, quality: 'm', moves: true },
      { role: 'T', number: 1, quality: 'P' },
    ],
  },
  {
    suffix: '7',
    tones: [
      { role: '7', number: 7, quality: 'm', moves: true },
      { role: '5', number: 5, quality: 'P' },
      { role: '3', number: 3, quality: 'M', moves: true },
      { role: 'T', number: 1, quality: 'P' },
    ],
  },
];

export default function SeptimaAcordesSection() {
  const { t } = useTranslation();
  const h = t('t3.s312.table_headers', { returnObjects: true }) as Record<string, string>;
  const names = t('t3.s312.chords', { returnObjects: true }) as string[];

  return (
    <section id="s-t3-acordes-septima" className={styles.section}>
      <SectionLabel text={t('t3.s312.label')} />
      <h2>{t('t3.s312.title')}</h2>

      <p className={styles.text}>{t('t3.s312.intro')}</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{h.chord}</th>
              <th scope="col">{h.formula}</th>
              <th scope="col">{h.code}</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.code}>
                <th scope="row">{names[i]}</th>
                <td>{r.formula}</td>
                <td>{r.code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.text}>{t('t3.s312.difference')}</p>

      <ChordStacks chords={CHORDS} />

      <RuleNote>{t('t3.s312.caption')}</RuleNote>

      <h3 className={styles.subheading}>{t('t3.s312.builder_title')}</h3>
      <p className={styles.text}>{t('t3.s312.builder_intro')}</p>
      <AcordesBuilder config={BUILDER_312} />
    </section>
  );
}
