import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import NoteToken from '../../../shared/NoteToken/NoteToken';
import Prose from '../../../shared/Prose/Prose';
import EscalaMayor from '../../../primitives/EscalaMayor/EscalaMayor';
import type { NoteSpelling } from '../../../../types/music';
import {
  ESCALA_EJEMPLO_INTRO,
  ESCALA_TABLA_HEAD,
  ESCALA_TABLA_NOTAS,
  ESCALA_INTERMEDIAS,
  ESCALA_PRIMITIVA_TITULO,
  ESCALA_PRIMITIVA_INSTRUCCION,
} from '../data/literalContent';
import styles from './EscalaMayorSection.module.css';

export default function EscalaMayorSection() {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      {/* TODO i18n: sin clave para label de la sección en de.json (se usa t1.s05/s06) */}
      <SectionLabel text={t('t1.s05.label')} />
      {/* TODO i18n: sin clave — h2 no tiene clave directa en de.json */}
      <h2>Escala mayor: notas estables y tensas</h2>

      <p className={styles.text}>{t('t1.s05.intro')}</p>

      <p className={styles.text}><Prose segment={ESCALA_EJEMPLO_INTRO} /></p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {ESCALA_TABLA_HEAD.map((h, i) => (
                <th key={i} scope="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {ESCALA_TABLA_NOTAS.map((c, i) =>
                i === 0 ? (
                  <th key={i} scope="row">{c}</th>
                ) : (
                  <td key={i}><NoteToken note={c as NoteSpelling} /></td>
                ),
              )}
            </tr>
          </tbody>
        </table>
      </div>

      {/* TODO i18n: sin clave — ESCALA_DIVISION_INTRO, ESCALA_INTERMEDIAS no tienen clave en de.json */}
      <p className={styles.text}>La escala se divide en:</p>
      <ul className={styles.divList}>
        <li>{t('t1.s05.stable_label')} {t('t1.s05.stable_degrees')}</li>
        <li>{ESCALA_INTERMEDIAS}</li>
        <li>{t('t1.s05.tense_label')} {t('t1.s05.tense_degrees')}</li>
      </ul>

      {/* TODO i18n: sin clave — primitiva título e instrucción */}
      <h3 className={styles.subheading}>{ESCALA_PRIMITIVA_TITULO}</h3>
      <p className={styles.text}>{ESCALA_PRIMITIVA_INSTRUCCION}</p>
      <EscalaMayor />
    </section>
  );
}
