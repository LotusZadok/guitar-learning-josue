import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import {
  INTRO_LENGUAS, INTRO_VARIEDAD,
  DEF_TONALIDADES, DEF_ARMADURA,
  REGLA_NO_MEZCLA, CONCLUSION_COHABITAN,
  INTRO_LENGUAS_DE, INTRO_VARIEDAD_DE,
  DEF_TONALIDADES_DE, DEF_ARMADURA_DE,
  REGLA_NO_MEZCLA_DE, CONCLUSION_COHABITAN_DE,
} from '../data/literalContent';
import styles from './IntroSection.module.css';

// Reunión 24/5/26: separar contenidos en líneas. Partimos los párrafos largos
// en oraciones (punto seguido) para mejorar la lectura. No se parafrasea texto.
function splitSentences(s: string): string[] {
  // Split en ". " pero preserva el punto al final de cada oración.
  const parts = s.split(/(?<=\.) +/);
  return parts.filter((p) => p.trim().length > 0);
}

function Paragraphs({ source, className }: { source: string; className: string }) {
  return (
    <>
      {splitSentences(source).map((sentence, i) => (
        <p key={i} className={className}>{sentence}</p>
      ))}
    </>
  );
}

export default function IntroSection() {
  const { t, i18n } = useTranslation();
  const isDe = i18n.language === 'de';

  return (
    <section id="s-t2-intro" className={styles.section}>
      <SectionLabel text={t('t2.s41.label')} />
      <h2>{t('t2.s41.title')}</h2>

      <Paragraphs source={isDe ? INTRO_LENGUAS_DE : INTRO_LENGUAS} className={styles.text} />
      <Paragraphs source={isDe ? INTRO_VARIEDAD_DE : INTRO_VARIEDAD} className={styles.text} />

      <RuleNote>
        <p><strong>{isDe ? 'Tonarten' : 'Tonalidades'}:</strong> {isDe ? DEF_TONALIDADES_DE : DEF_TONALIDADES}</p>
        <p><strong>{isDe ? 'Vorzeichen' : 'Armadura'}:</strong> {isDe ? DEF_ARMADURA_DE : DEF_ARMADURA}</p>
        <p><strong>{isDe ? 'Regel' : 'Regla'}:</strong> {isDe ? REGLA_NO_MEZCLA_DE : REGLA_NO_MEZCLA}</p>
      </RuleNote>

      <p className={styles.conclusion}>{isDe ? CONCLUSION_COHABITAN_DE : CONCLUSION_COHABITAN}</p>
    </section>
  );
}
