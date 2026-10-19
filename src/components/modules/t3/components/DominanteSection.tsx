import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import DominanteResolucion from '../../../primitives/DominanteResolucion/DominanteResolucion';
import type { OrigenDominante } from '../../../../utils/noteCalculations';
import styles from './DominanteSection.module.css';

// 3.6 · Dominante X7 (V7). El acorde de séptima sobre el 5º grado, su tritono
// interno, y la resolución V7 → I por conducción de voces.
export default function DominanteSection() {
  const { t } = useTranslation();
  // Reunión 19/10/26: el texto explica el acorde elegido. Con el vii° el
  // tritono ya no es la 3ª y la 7ª del acorde sino su tónica y su 5ª.
  const [origen, setOrigen] = useState<OrigenDominante>('V7');

  return (
    <section id="s-t3-dominante" className={styles.section}>
      <SectionLabel text={t('t3.s36.label')} />
      <h2>{t('t3.s36.title')}</h2>

      <p className={styles.text}>{t(`t3.s36.intro_${origen}`)}</p>

      <DominanteResolucion
        origen={origen}
        onOrigenChange={setOrigen}
        labels={{
          selector: t('t3.s36.selector_label'),
          diagram: (desde, hacia) => t('t3.s36.diagram_label', { origen: desde, destino: hacia }),
        }}
      />

      <p className={styles.text}>{t(`t3.s36.resolution_${origen}`)}</p>
    </section>
  );
}
