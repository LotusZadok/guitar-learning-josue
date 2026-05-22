import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import Prose from '../../../shared/Prose/Prose';
import ChromaticCircleSection from '../../../primitives/ChromaticCircle/ChromaticCircleSection';
import type { NoteSpelling } from '../../../../types/music';
import {
  CC_TABLA,
  CC_NO_ALTERADA,
  CC_NO_ALTERADA_DE,
} from '../data/literalContent';
import styles from './CirculoCromaticoSection.module.css';

function renderCcCell(cell: string) {
  const parts = cell.split('/') as NoteSpelling[];
  return parts.map((p, i) => (
    <Fragment key={i}>
      {i > 0 && '/'}
      <NoteToken note={p} />
    </Fragment>
  ));
}

export default function CirculoCromaticoSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const ccNoAlterada = locale === 'de' ? CC_NO_ALTERADA_DE : CC_NO_ALTERADA;

  return (
    <section id="s-circulo" className={styles.section}>
      <SectionLabel text={t('t1.s03.label')} />
      <h2>{t('t1.s03.title')}</h2>

      <p className={styles.text}>{t('t1.s03.intro')}</p>

      <ul className={styles.defs}>
        <li>{t('t1.s03.sharp_def')}</li>
        <li>{t('t1.s03.flat_def')}</li>
      </ul>

      <p className={styles.text}>{t('t1.s03.body')}</p>

      <div className={styles.ccStripWrap}>
        <ol className={styles.ccStrip} aria-label="Las 12 notas del círculo cromático">
          {CC_TABLA.map((n) => (
            <li key={n}>{renderCcCell(n)}</li>
          ))}
        </ol>
      </div>

      <RuleNote><Prose segment={ccNoAlterada} /></RuleNote>

      <ChromaticCircleSection />
    </section>
  );
}
