import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import {
  NATURALES_TABLA_ES,
  NATURALES_TABLA_EN,
} from '../data/literalContent';
import styles from './NotasNaturalesSection.module.css';

export default function NotasNaturalesSection() {
  const { t } = useTranslation();

  return (
    <section id="s-notas" className={styles.section}>
      <SectionLabel text={t('t1.s01.label')} />
      <h2>{t('t1.s01.title')}</h2>

      <p className={styles.text}>{t('t1.s01.intro')}</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {NATURALES_TABLA_ES.map((n) => (
                <th key={n} scope="col">{n}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {NATURALES_TABLA_EN.map((n) => (
                <td key={n}><NoteToken note={n} /></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className={styles.text}>{t('t1.s01.body')}</p>
      <p className={styles.text}>{t('t1.s01.rule')}</p>

      <RuleNote>{t('t1.s01.tip')}</RuleNote>
    </section>
  );
}
