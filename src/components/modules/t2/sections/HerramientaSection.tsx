import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import RuleNote from '../../../shared/RuleNote';
import {
  HERRAMIENTA_INTRO,
  HERRAMIENTA_INTRO_DE,
  HERRAMIENTA_SOSTENIDOS,
  HERRAMIENTA_BEMOLES,
  HERRAMIENTA_SOSTENIDOS_EXPLICACION,
  HERRAMIENTA_SOSTENIDOS_EXPLICACION_DE,
  HERRAMIENTA_BEMOLES_EXPLICACION,
  HERRAMIENTA_BEMOLES_EXPLICACION_DE,
  PROPIEDAD_ESPECIFICO,
  PROPIEDAD_ESPECIFICO_DE,
  PROPIEDAD_ACUMULATIVO,
  PROPIEDAD_ACUMULATIVO_DE,
  PROPIEDAD_MULTITONAL,
  PROPIEDAD_MULTITONAL_DE,
  CONSEJO_MEMORIZAR,
  CONSEJO_MEMORIZAR_DE,
} from '../data/literalContent';
import styles from './HerramientaSection.module.css';

function toFlat(s: string): string {
  return s.replace(/([A-G])b/g, '$1♭');
}

export default function HerramientaSection() {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';

  const intro = isDe ? HERRAMIENTA_INTRO_DE : HERRAMIENTA_INTRO;
  const sharpsExp = isDe ? HERRAMIENTA_SOSTENIDOS_EXPLICACION_DE : HERRAMIENTA_SOSTENIDOS_EXPLICACION;
  const flatsExp = isDe ? HERRAMIENTA_BEMOLES_EXPLICACION_DE : HERRAMIENTA_BEMOLES_EXPLICACION;
  const propEspecifico = isDe ? PROPIEDAD_ESPECIFICO_DE : PROPIEDAD_ESPECIFICO;
  const propAcumulativo = isDe ? PROPIEDAD_ACUMULATIVO_DE : PROPIEDAD_ACUMULATIVO;
  const propMultitonal = isDe ? PROPIEDAD_MULTITONAL_DE : PROPIEDAD_MULTITONAL;
  const consejo = isDe ? CONSEJO_MEMORIZAR_DE : CONSEJO_MEMORIZAR;

  const sectionLabel = isDe ? '2.2 · Reihenfolge der Vorzeichen' : '2.2 · Orden de las alteraciones';
  const titleEspecifico = isDe ? 'Spezifisch' : 'Específico';
  const titleAcumulativo = isDe ? 'Kumulativ' : 'Acumulativo';
  const titleMultitonal = 'Multitonal';

  const especificoParts = propEspecifico.split(' — ');

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
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{titleEspecifico}</h3>
          <p className={styles.cardText}>
            {especificoParts[0]}
            <br />
            {toFlat(especificoParts[1])}
          </p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{titleAcumulativo}</h3>
          <p className={styles.cardText}>{propAcumulativo}</p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>{titleMultitonal}</h3>
          <p className={styles.cardText}>{propMultitonal}</p>
        </div>
      </div>

      <RuleNote>
        <strong>{consejo}</strong>
      </RuleNote>
    </section>
  );
}
