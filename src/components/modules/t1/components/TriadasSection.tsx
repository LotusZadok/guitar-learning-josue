import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import Prose from '../../../shared/Prose/Prose';
import TriadsSection from '../../../primitives/Triads/TriadsSection';
import type { NoteSpelling } from '../../../../types/music';
import {
  TRIADAS_TABLA_HEAD,
  TRIADAS_TABLA_ROW,
  TRIADAS_MAESTRA,
  TRIADAS_EJEMPLO,
  TRIADAS_EJEMPLO_DE,
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
  const ejemplo = locale === 'de' ? TRIADAS_EJEMPLO_DE : TRIADAS_EJEMPLO;
  const procedure = t('t1.s02.procedure', { returnObjects: true }) as string[];

  return (
    <section className={styles.section}>
      <SectionLabel text={t('t1.s02.label')} />
      {/* TODO i18n: sin clave — h2 combinado no tiene clave directa */}
      <h2>Construcción de las 7 tríadas y la tríada maestra</h2>

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

      <p className={styles.ejemplo}><Prose segment={ejemplo} /></p>

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

      {/* TRIADAS_MAESTRA es ProseSegment no listado para bifurcación — queda en español */}
      <p className={styles.maestra}><Prose segment={TRIADAS_MAESTRA} /></p>

      <RuleNote>{t('t1.s02.tip')}</RuleNote>

      <TriadsSection />
    </section>
  );
}
