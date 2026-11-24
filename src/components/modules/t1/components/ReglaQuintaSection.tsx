import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import Prose from '../../../shared/Prose/Prose';
import CirculoDeQuintas from '../../../primitives/CirculoDeQuintas/CirculoDeQuintas';
import type { ProseSegment } from '../../../../types/prose';
import { useUIStore } from '../../../../stores/useUIStore';
import { octavasDesdeLaPrimera } from '../../../../utils/noteCalculations';
import { conOctavas, notasDe } from '../../../../utils/prose';
import styles from './ReglaQuintaSection.module.css';

interface ReglaBullet {
  regla: string;
  desc: string;
  ejemplo: ProseSegment;
}

export default function ReglaQuintaSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const tonic = useUIStore((s) => s.tonic);
  // #24: cada ejemplo sube desde su raíz (la primera nota), con cualquier tónica.
  const anclar = (segment: ProseSegment) =>
    conOctavas(segment, octavasDesdeLaPrimera(tonic, notasDe(segment)));

  const bullets = t('t1.s08.bullets', { returnObjects: true }) as ReglaBullet[];
  const excepcionB = t('t1.s08.exception_b', { returnObjects: true }) as ProseSegment;
  const excepcionBb = t('t1.s08.exception_bb', { returnObjects: true }) as ProseSegment;
  const primitiva = t('t1.s08.fifths_instruction', { returnObjects: true }) as ProseSegment;
  const notaBemoles = t('t1.s08.flats_note', { returnObjects: true }) as ProseSegment;

  return (
    <section id="s-quinta" className={styles.section}>
      <SectionLabel text={t('t1.s08.label')} />
      <h2>{t('t1.s08.title')}</h2>

      <p className={styles.text}>{t('t1.s08.intro')}</p>

      <ul className={styles.bullets}>
        {bullets.map((b, i) => (
          <li key={i}>
            <strong>{b.regla}</strong> · {b.desc}
            {/* Reunión 9/6/26: el ejemplo baja a una línea propia, separada de la idea. */}
            <span className={styles.ejemplo}>{locale === 'de' ? 'Beispiel' : 'Ejemplo'}: <Prose segment={anclar(b.ejemplo)} /></span>
          </li>
        ))}
      </ul>

      <h3 className={styles.subheading}>{locale === 'de' ? 'Ausnahmen' : 'Excepciones'}</h3>
      <ul className={styles.bullets}>
        <li><Prose segment={anclar(excepcionB)} /></li>
        <li><Prose segment={anclar(excepcionBb)} /></li>
      </ul>

      <h3 className={styles.subheading}>{t('t1.s08.fifths_title')}</h3>
      <p className={styles.text}><Prose segment={anclar(primitiva)} /></p>
      <CirculoDeQuintas />

      <p className={styles.footnote}><Prose segment={anclar(notaBemoles)} /></p>

      <RuleNote>{t('t1.s08.tip')}</RuleNote>
    </section>
  );
}
