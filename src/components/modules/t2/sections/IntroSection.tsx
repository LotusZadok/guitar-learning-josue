import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
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

      <Paragraphs source={t('t2.s41.intro_languages')} className={styles.text} />
      <Paragraphs source={t('t2.s41.intro_variety')} className={styles.text} />

      <RuleNote>
        <p><strong>{isDe ? 'Tonarten' : 'Tonalidades'}:</strong> {t('t2.s41.def_tonalities')}</p>
        <p><strong>{isDe ? 'Vorzeichen' : 'Armadura'}:</strong> {t('t2.s41.def_key_signature')}</p>
        <p><strong>{isDe ? 'Regel' : 'Regla'}:</strong> {t('t2.s41.rule_no_mix')}</p>
      </RuleNote>

      <p className={styles.conclusion}>{t('t2.s41.conclusion')}</p>
    </section>
  );
}
