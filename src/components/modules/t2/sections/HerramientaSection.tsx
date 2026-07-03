import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import styles from './HerramientaSection.module.css';

// Datos musicales (§2.2): la herramienta F C G D A E B con sus alteraciones,
// no UI copy.
const HERRAMIENTA_SOSTENIDOS = ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'] as const;
const HERRAMIENTA_BEMOLES = ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'] as const;

function toFlat(s: string): string {
  return s.replace(/([A-G])b/g, '$1♭');
}

// Reunión 9/6/26: los bloques "Ejemplo: ..." bajan a una línea propia, separada
// de la idea. El split es solo de render; el texto literal del método queda
// intacto en los locales i18n (el separador " — " entre ejemplos lo absorbe el
// salto de línea, igual que hacía el <br/> anterior).
function splitEjemplos(text: string): { idea: string; ejemplos: string[] } {
  const parts = text.split(/(?=Ejemplo:|Beispiel:)/g);
  return {
    idea: parts[0].replace(/\s*—\s*$/, '').trim(),
    ejemplos: parts.slice(1).map((p) => p.replace(/\s*—\s*$/, '').trim()),
  };
}

export default function HerramientaSection() {
  const { t, i18n } = useTranslation();
  const isDe = i18n.language === 'de';

  const intro = t('t2.s44.intro');
  const sharpsExp = t('t2.s44.sharps_explanation');
  const flatsExp = t('t2.s44.flats_explanation');
  const propEspecifico = t('t2.s44.prop_specific');
  const propAcumulativo = t('t2.s44.prop_cumulative');
  const propMultitonal = t('t2.s44.prop_multitonal');
  const consejo = t('t2.s44.tip');

  const sectionLabel = t('t2.s44.label');
  const titleEspecifico = isDe ? 'Spezifisch' : 'Específico';
  const titleAcumulativo = isDe ? 'Kumulativ' : 'Acumulativo';
  const titleMultitonal = 'Multitonal';

  const cards = [
    { titulo: titleEspecifico, ...splitEjemplos(propEspecifico) },
    { titulo: titleAcumulativo, ...splitEjemplos(propAcumulativo) },
    { titulo: titleMultitonal, ...splitEjemplos(propMultitonal) },
  ];

  return (
    <section id="s-t2-herramienta" className={styles.section}>
      <SectionLabel text={sectionLabel} />
      <h2>F C G D A E B</h2>

      <p className={styles.text}>{intro}</p>

      <div className={styles.toolBox}>
        <div className={styles.toolRow}>
          <span className={styles.rowLabel}>#</span>
          {HERRAMIENTA_SOSTENIDOS.map(n => (
            <span key={n} className={styles.noteSharp}>{n}</span>
          ))}
        </div>
        <div className={styles.toolRow}>
          <span className={styles.rowLabel}>♭</span>
          {HERRAMIENTA_BEMOLES.map(n => (
            <span key={n} className={styles.noteFlat}>{toFlat(n)}</span>
          ))}
        </div>
      </div>

      <p className={styles.text}>{sharpsExp}</p>
      <p className={styles.text}>{flatsExp}</p>

      <div className={styles.cards}>
        {cards.map(({ titulo, idea, ejemplos }) => (
          <div key={titulo} className={styles.card}>
            <h3 className={styles.cardTitle}>{titulo}</h3>
            <p className={styles.cardText}>
              {idea}
              {ejemplos.map((e) => (
                <span key={e} className={styles.cardEjemplo}>{toFlat(e)}</span>
              ))}
            </p>
          </div>
        ))}
      </div>

      <RuleNote>
        <strong>{consejo}</strong>
      </RuleNote>
    </section>
  );
}
