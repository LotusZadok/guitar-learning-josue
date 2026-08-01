import { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import Prose from '../../../shared/Prose/Prose';
import TriadsSection from '../../../primitives/Triads/TriadsSection';
import TriadaProceso from '../../../primitives/TriadaProceso/TriadaProceso';
import type { NaturalNote, NoteSpelling } from '../../../../types/music';
import type { ProseSegment } from '../../../../types/prose';
import { useUIStore } from '../../../../stores/useUIStore';
import { NATURALS } from '../../../../data/notes';
import styles from './TriadasSection.module.css';

// Datos musicales (§1.6): las 7 tríadas de las notas naturales, rotadas desde la
// letra de la tónica global. La etapa pedagógica es sin alteraciones, así que se
// toma sólo la letra (igual que TriadaProceso).
function buildTriadTable(root: NaturalNote): { head: NaturalNote[]; row: string[] } {
  const start = NATURALS.indexOf(root);
  const head = Array.from({ length: 7 }, (_, i) => NATURALS[(start + i) % 7]);
  const row = head.map((letter) => {
    const li = NATURALS.indexOf(letter);
    return [0, 2, 4].map((o) => NATURALS[(li + o) % 7]).join(' ');
  });
  return { head, row };
}

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
  const maestra = t('t1.s02.master_triad', { returnObjects: true }) as ProseSegment;
  const tonic = useUIStore((s) => s.tonic);
  const { head, row } = useMemo(() => buildTriadTable(tonic[0] as NaturalNote), [tonic]);

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
              {head.map((h) => (
                <th key={h} scope="col"><NoteToken note={h} /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {row.map((c, i) => (
                <td key={i}>{renderTriadCell(c)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className={styles.maestra}><Prose segment={maestra} /></p>

      <RuleNote>{t('t1.s02.tip')}</RuleNote>

      <TriadsSection />
    </section>
  );
}
