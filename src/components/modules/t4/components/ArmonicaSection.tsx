import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import GradosArmonicos from '../../../primitives/GradosArmonicos/GradosArmonicos';
import { useUIStore } from '../../../../stores/useUIStore';
import {
  acordeMenorArmonica,
  formatChordSymbol,
  formatNote,
  gradosQueCambianEnArmonica,
  harmonicMinorScaleSpelled,
  nombreNota,
} from '../../../../utils/noteCalculations';
import styles from './ArmonicaSection.module.css';

// 4.4 · Escala menor armónica (borrador del 19/10/26). El profesor pidió "un
// solo tema, pero con dos subtítulos": la escala y sus grados armónicos. Como
// 4.2, se ancla en la relativa menor de la tónica global.
export default function ArmonicaSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const tonic = useUIStore((s) => s.tonic);

  const escala = harmonicMinorScaleSpelled(tonic);
  const tonica = nombreNota(escala[0], lang);
  const cambios = t('t4.s44.cambios', { returnObjects: true }) as string[];
  const acordes = gradosQueCambianEnArmonica(true).map((g) =>
    formatChordSymbol(acordeMenorArmonica(tonic, g).cifrado, lang),
  );

  return (
    <section id="s-t4-armonica" className={styles.section}>
      <SectionLabel text={t('t4.s44.label')} />
      <h2>{t('t4.s44.title')}</h2>

      <h3 className={styles.subheading}>{t('t4.s44.escala_titulo')}</h3>
      <p className={styles.text}>{t('t4.s44.natural')}</p>
      <p className={styles.text}>
        {t('t4.s44.armonica', { tonica, escala: escala.map((n) => formatNote(n, lang)).join(' ') })}
      </p>
      <p className={styles.text}>{t('t4.s44.arabe')}</p>
      <p className={styles.text}>{t('t4.s44.sensible')}</p>

      <h3 className={styles.subheading}>{t('t4.s44.grados_titulo')}</h3>
      <p className={styles.text}>
        {t('t4.s44.cambio', { tonica, sensible: nombreNota(escala[6], lang) })}
      </p>

      <GradosArmonicos tonalidad={tonic} initialStep={4} harmonicMinor />

      <ul className={styles.cambios}>
        {cambios.map((_, i) => (
          <li key={i}>{t('t4.s44.cambios.' + i, { acorde: acordes[i] })}</li>
        ))}
      </ul>

      <p className={styles.text}>{t('t4.s44.importa')}</p>
      <p className={styles.text}>{t('t4.s44.laboratorio')}</p>
    </section>
  );
}
