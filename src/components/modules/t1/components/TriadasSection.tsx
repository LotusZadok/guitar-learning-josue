import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import Prose from '../../../shared/Prose/Prose';
import TriadsSection from '../../../primitives/Triads/TriadsSection';
import TriadaProceso from '../../../primitives/TriadaProceso/TriadaProceso';
import type { NoteSpelling } from '../../../../types/music';
import {
  TRIADAS_TABLA_HEAD,
  TRIADAS_TABLA_ROW,
  TRIADAS_MAESTRA,
  TRIADAS_MAESTRA_DE,
} from '../data/literalContent';
import styles from './TriadasSection.module.css';

function renderTriadCell(cell: string) {
  const parts = cell.split(' ') as NoteSpelling[];
  return parts.map((p, i) => (
    <Fragment key={i}>
      {i > 0 && ' '}
      <NoteToken note={p} />
    </Fragment>
  ));
}

export default function TriadasSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const procedure = t('t1.s02.procedure', { returnObjects: true }) as string[];

  return (
    <section id="s-triadas" className={styles.section}>
      <SectionLabel text={t('t1.s02.label')} />
      <h2>{locale === 'de'
        ? 'Aufbau der 7 Dreiklänge und des Meisterdreiklangs'
        : 'Construcción de las 7 tríadas y la tríada maestra'}</h2>

      <p className={styles.text}>{t('t1.s02.intro')}</p>

      <ul className={styles.notas}>
        <li>{t('t1.s02.roles.tonic')}</li>
        <li>{t('t1.s02.roles.third')}</li>
        <li>{t('t1.s02.roles.fifth')}</li>
      </ul>

      <h3 className={styles.subheading}>{t('t1.s02.procedure_title')}</h3>
      <ol className={styles.steps}>
        {procedure.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>

      <TriadaProceso />

      <p className={styles.text}>{t('t1.s02.table_title')}</p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {TRIADAS_TABLA_HEAD.map((h) => (
                <th key={h} scope="col"><NoteToken note={h} /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {TRIADAS_TABLA_ROW.map((c, i) => (
                <td key={i}>{renderTriadCell(c)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className={styles.maestra}><Prose segment={locale === 'de' ? TRIADAS_MAESTRA_DE : TRIADAS_MAESTRA} /></p>

      <RuleNote>{t('t1.s02.tip')}</RuleNote>

      <TriadsSection />
    </section>
  );
}
