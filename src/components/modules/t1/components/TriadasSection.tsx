import { Fragment, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import Prose from '../../../shared/Prose/Prose';
import NoteSelector from '../../../shared/NoteSelector';
import TriadsSection from '../../../primitives/Triads/TriadsSection';
import { NATURALS } from '../../../../data/notes';
import type { NoteSpelling, NaturalNote } from '../../../../types/music';
import type { ProseSegment } from '../../../../types/prose';
import {
  TRIADAS_TABLA_HEAD,
  TRIADAS_TABLA_ROW,
  TRIADAS_MAESTRA,
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

function buildEjemplo(root: NaturalNote, locale: string): ProseSegment {
  const i = NATURALS.indexOf(root);
  const n1 = NATURALS[(i + 1) % 7] as NaturalNote;
  const n2 = NATURALS[(i + 2) % 7] as NaturalNote;
  const n3 = NATURALS[(i + 3) % 7] as NaturalNote;
  const n4 = NATURALS[(i + 4) % 7] as NaturalNote;

  if (locale === 'de') {
    return [
      { type: 'text', value: 'Beispiel: ' },
      { type: 'note', value: root },
      { type: 'text', value: ' → ' },
      { type: 'note', value: n1 },
      { type: 'text', value: ' auslassen → ' },
      { type: 'note', value: n2 },
      { type: 'text', value: ' → ' },
      { type: 'note', value: n3 },
      { type: 'text', value: ' auslassen → ' },
      { type: 'note', value: n4 },
      { type: 'text', value: '. Der Dreiklang von ' },
      { type: 'note', value: root },
      { type: 'text', value: ' ist ' },
      { type: 'note', value: root }, { type: 'text', value: ' ' },
      { type: 'note', value: n2 }, { type: 'text', value: ' ' },
      { type: 'note', value: n4 }, { type: 'text', value: '.' },
    ];
  }

  return [
    { type: 'text', value: 'Ejemplo: ' },
    { type: 'note', value: root },
    { type: 'text', value: ' → omito ' },
    { type: 'note', value: n1 },
    { type: 'text', value: ' → ' },
    { type: 'note', value: n2 },
    { type: 'text', value: ' → omito ' },
    { type: 'note', value: n3 },
    { type: 'text', value: ' → ' },
    { type: 'note', value: n4 },
    { type: 'text', value: '. La tríada de ' },
    { type: 'note', value: root },
    { type: 'text', value: ' es ' },
    { type: 'note', value: root }, { type: 'text', value: ' ' },
    { type: 'note', value: n2 }, { type: 'text', value: ' ' },
    { type: 'note', value: n4 }, { type: 'text', value: '.' },
  ];
}

export default function TriadasSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const [exampleRoot, setExampleRoot] = useState<NaturalNote>('F');
  const procedure = t('t1.s02.procedure', { returnObjects: true }) as string[];
  const ejemplo = useMemo(() => buildEjemplo(exampleRoot, locale), [exampleRoot, locale]);

  return (
    <section id="s-triadas" className={styles.section}>
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

      <NoteSelector
        notes={[...NATURALS]}
        selected={exampleRoot}
        onSelect={(n) => setExampleRoot(n as NaturalNote)}
      />
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
