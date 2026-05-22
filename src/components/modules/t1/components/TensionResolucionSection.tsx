import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import Prose from '../../../shared/Prose/Prose';
import TensionResolucion from '../../../primitives/TensionResolucion/TensionResolucion';
import { useUIStore } from '../../../../stores/useUIStore';
import { NOTE_ES } from '../../../../data/notes';
import {
  TENSION_REGLAS,
  TENSION_REGLAS_DE,
  TENSION_PRIMITIVA_INSTRUCCION,
  TENSION_PRIMITIVA_INSTRUCCION_DE,
} from '../data/literalContent';

const NOTE_DE_NAME: Record<string, string> = {
  C: 'C', 'C#': 'Cis', D: 'D', 'D#': 'Dis', E: 'E', F: 'F',
  'F#': 'Fis', G: 'G', 'G#': 'Gis', A: 'A', 'A#': 'B', B: 'H',
};
import styles from './TensionResolucionSection.module.css';

export default function TensionResolucionSection() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const reglas = locale === 'de' ? TENSION_REGLAS_DE : TENSION_REGLAS;
  const tonic = useUIStore((s) => s.tonic);

  return (
    <section id="s-tension" className={styles.section}>
      <SectionLabel text={t('t1.s05.label')} />
      <h2>{t('t1.s05.title')}</h2>

      <p className={styles.text}>{t('t1.s05.tension_title')}</p>

      <ol className={styles.reglas}>
        {reglas.map((r) => (
          <li key={r.titulo}>
            <span className={styles.reglaTitulo}>{r.titulo}</span> · <Prose segment={r.cuerpo} />
          </li>
        ))}
      </ol>

      <h3 className={styles.subheading}>{locale === 'de'
        ? `Karte der Auflösungen in ${NOTE_DE_NAME[tonic] ?? tonic} Dur`
        : `Mapa de resoluciones en ${NOTE_ES[tonic]} mayor`}</h3>
      <p className={styles.text}>{locale === 'de' ? TENSION_PRIMITIVA_INSTRUCCION_DE : TENSION_PRIMITIVA_INSTRUCCION}</p>
      <TensionResolucion />

      <RuleNote>{t('t1.s05.tip')}</RuleNote>
    </section>
  );
}
