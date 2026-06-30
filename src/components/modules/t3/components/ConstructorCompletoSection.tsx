import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import AcordesBuilder from '../../../primitives/AcordesBuilder/AcordesBuilder';
import { BUILDER_34 } from '../../../primitives/AcordesBuilder/configs';
import styles from './ConstructorCompletoSection.module.css';

// 3.4 · Constructor de acordes completo. Los 10 acordes del método en un solo
// árbol. Es el clímax de las versiones progresivas del constructor.
const CHORDS = [
  { code: 'sus2', formula: 'T 2 5' },
  { code: 'm', formula: 'T 3m 5' },
  { code: '°', formula: 'T 3m 5d' },
  { code: 'M', formula: 'T 3M 5' },
  { code: 'sus4', formula: 'T 4 5' },
  { code: 'm7', formula: 'T 3m 5 7m' },
  { code: 'maj7', formula: 'T 3M 5 7M' },
  { code: '7', formula: 'T 3M 5 7m' },
  { code: 'm7♭5', formula: 'T 3m 5d 7m' },
  { code: 'dim7', formula: 'T 3m 5d 7d' },
] as const;

export default function ConstructorCompletoSection() {
  const { t } = useTranslation();

  return (
    <section id="s-t3-constructor-completo" className={styles.section}>
      <SectionLabel text={t('t3.s34.label')} />
      <h2>{t('t3.s34.title')}</h2>

      <p className={styles.text}>{t('t3.s34.intro')}</p>

      <AcordesBuilder config={BUILDER_34} />

      <p className={styles.caption}>{t('t3.s34.caption')}</p>

      <ul className={styles.chordList}>
        {CHORDS.map((c) => (
          <li key={c.code} className={styles.chordItem}>
            <span className={styles.code}>{c.code}</span>
            <span className={styles.formula}>{c.formula}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
