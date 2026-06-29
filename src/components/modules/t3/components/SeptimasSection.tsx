import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import Septimas from '../../../primitives/Septimas/Septimas';
import styles from './SeptimasSection.module.css';

// 3.1.1 · Las nuevas séptimas. Las tres calidades de séptima que se usan para
// armar acordes (7M, 7m, 7d). Datos pedagógicos del source of truth de T3.
const SEVENTHS = [
  { role: '7M', chord: 'maj7', semis: 11, enh: '' },
  { role: '7m', chord: '7', semis: 10, enh: '' },
  { role: '7d', chord: 'dim7', semis: 9, enh: '6M' },
] as const;

export default function SeptimasSection() {
  const { t } = useTranslation();
  const h = t('t3.s311.table_headers', { returnObjects: true }) as Record<string, string>;

  return (
    <section id="s-t3-septimas" className={styles.section}>
      <SectionLabel text={t('t3.s311.label')} />
      <h2>{t('t3.s311.title')}</h2>

      <p className={styles.text}>{t('t3.s311.intro')}</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{h.interval}</th>
              <th scope="col">{h.chord}</th>
              <th scope="col">{h.semitones}</th>
              <th scope="col">{h.enharmonic}</th>
            </tr>
          </thead>
          <tbody>
            {SEVENTHS.map((s) => (
              <tr key={s.role}>
                <th scope="row">{s.role}</th>
                <td>{s.chord}</td>
                <td>{s.semis}</td>
                <td>{s.enh}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.text}>{t('t3.s311.new_seventh')}</p>

      <Septimas />
    </section>
  );
}
