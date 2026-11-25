import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import AcordesBuilder from '../../../primitives/AcordesBuilder/AcordesBuilder';
import { BUILDER_43 } from '../../../primitives/AcordesBuilder/configs';
import { useUIStore } from '../../../../stores/useUIStore';
import {
  formatChordSymbol,
  formatNote,
  intervalLabel,
  intervalMemberFromTonic,
  nombreNota,
} from '../../../../utils/noteCalculations';
import styles from './AumentadosSection.module.css';

// 4.3 · Acordes aumentados (borrador del 19/10/26). Va antes de la menor
// armónica (4.4), como lo ordenó el profesor: primero el tipo de acorde, y en
// 4.4 de dónde sale. Los ejemplos siguen a la tónica global.
export default function AumentadosSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const tonic = useUIStore((s) => s.tonic);

  const notas = [
    intervalMemberFromTonic(tonic, 1, 'P'),
    intervalMemberFromTonic(tonic, 3, 'M'),
    intervalMemberFromTonic(tonic, 5, 'aug'),
  ].map((m) => m.spelled);
  // Simétrico: cada nota del acorde es raíz de un aumentado con las mismas notas.
  const simetria = notas.map((n) => formatChordSymbol(n + '+', lang)).join(' = ');

  return (
    <section id="s-t4-aumentados" className={styles.section}>
      <SectionLabel text={t('t4.s43.label')} />
      <h2>{t('t4.s43.title')}</h2>

      <p className={styles.text}>
        {t('t4.s43.intro', {
          formula: `T + ${intervalLabel('3M', lang)} + ${intervalLabel('5a', lang)}`,
          tonica: nombreNota(notas[0], lang),
          notas: notas.map((n) => formatNote(n, lang)).join(' '),
          cifrado: formatChordSymbol(notas[0] + '+', lang),
        })}
      </p>
      <p className={styles.text}>{t('t4.s43.simetria', { simetria })}</p>
      <p className={styles.text}>{t('t4.s43.origen')}</p>
      <p className={styles.text}>{t('t4.s43.sonido')}</p>

      <p className={styles.text}>{t('t4.s43.arbol')}</p>
      <AcordesBuilder config={BUILDER_43} />
    </section>
  );
}
