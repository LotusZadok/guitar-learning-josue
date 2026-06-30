import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import ChordStacks, { type ChordDef } from '../../../primitives/ChordStacks/ChordStacks';
import AcordesBuilder from '../../../primitives/AcordesBuilder/AcordesBuilder';
import { BUILDER_33 } from '../../../primitives/AcordesBuilder/configs';
import styles from './SuspendidosSection.module.css';

// 3.3 · Acordes suspendidos. sus2 y sus4 reemplazan la tercera por la 2M o la 4J;
// comparten T y 5J. Fórmulas del source of truth de T3.
const ROWS = [
  { formula: 'T + 2M + 5J', code: 'sus2' },
  { formula: 'T + 4J + 5J', code: 'sus4' },
] as const;

// La nota del medio (2 o 4) es la que cambia; T y 5 son compartidas.
const CHORDS: ChordDef[] = [
  {
    suffix: 'sus2',
    tones: [
      { role: '5', number: 5, quality: 'P' },
      { role: '2', number: 2, quality: 'M', moves: true },
      { role: 'T', number: 1, quality: 'P' },
    ],
  },
  {
    suffix: 'sus4',
    tones: [
      { role: '5', number: 5, quality: 'P' },
      { role: '4', number: 4, quality: 'P', moves: true },
      { role: 'T', number: 1, quality: 'P' },
    ],
  },
];

export default function SuspendidosSection() {
  const { t } = useTranslation();
  const h = t('t3.s33.table_headers', { returnObjects: true }) as Record<string, string>;
  const names = t('t3.s33.chords', { returnObjects: true }) as string[];

  return (
    <section id="s-t3-suspendidos" className={styles.section}>
      <SectionLabel text={t('t3.s33.label')} />
      <h2>{t('t3.s33.title')}</h2>

      <p className={styles.text}>{t('t3.s33.intro')}</p>

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

      <ChordStacks chords={CHORDS} />

      <p className={styles.caption}>{t('t3.s33.caption')}</p>

      <h3 className={styles.subheading}>{t('t3.s33.resolution_title')}</h3>
      <p className={styles.text}>{t('t3.s33.resolution')}</p>

      <h3 className={styles.subheading}>{t('t3.s33.builder_title')}</h3>
      <p className={styles.text}>{t('t3.s33.builder_intro')}</p>
      <AcordesBuilder config={BUILDER_33} />
    </section>
  );
}
