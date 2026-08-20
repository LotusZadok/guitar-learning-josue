import { useTranslation } from 'react-i18next';
import { ARMADURAS, armaduraPorId, etiquetaTonalidad } from '../../../utils/progresionAcordes';
import type { Modo } from '../../../utils/progresionArmonica';
import styles from './ArmaduraSelector.module.css';

interface Props {
  armaduraId: string;
  modo: Modo;
  onArmadura: (id: string) => void;
  onModo: (modo: Modo) => void;
}

function etiquetaArmadura(alteraciones: number, tipo: 'sostenido' | 'bemol'): string {
  if (alteraciones === 0) return '♮';
  return `${alteraciones}${tipo === 'sostenido' ? '♯' : '♭'}`;
}

// Escenario 1 del profesor: primero la armadura, después cuál de las dos
// tonalidades que la comparten. A y F♯m tienen la misma armadura; elegir una
// determina los grados que se despliegan abajo.
export default function ArmaduraSelector({ armaduraId, modo, onArmadura, onModo }: Props) {
  const { t } = useTranslation();
  const activa = armaduraPorId(armaduraId);
  const sostenidos = ARMADURAS.filter((a) => a.tipo === 'sostenido');
  const bemoles = ARMADURAS.filter((a) => a.tipo === 'bemol');

  return (
    <div className={styles.wrap}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{t('t4.s41.armadura_label')}</legend>

        <div className={styles.fila} role="group" aria-label={t('t4.s41.sostenidos')}>
          {sostenidos.map((a) => (
            <button
              key={a.id}
              type="button"
              className={styles.armadura}
              aria-pressed={a.id === armaduraId}
              onClick={() => onArmadura(a.id)}
            >
              {etiquetaArmadura(a.alteraciones, a.tipo)}
            </button>
          ))}
        </div>

        <div className={styles.fila} role="group" aria-label={t('t4.s41.bemoles')}>
          {bemoles.map((a) => (
            <button
              key={a.id}
              type="button"
              className={styles.armadura}
              aria-pressed={a.id === armaduraId}
              onClick={() => onArmadura(a.id)}
            >
              {etiquetaArmadura(a.alteraciones, a.tipo)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{t('t4.s41.tonalidad_label')}</legend>
        <div className={styles.fila}>
          {(['mayor', 'menor'] as const).map((m) => (
            <button
              key={m}
              type="button"
              className={styles.tonalidad}
              aria-pressed={m === modo}
              onClick={() => onModo(m)}
            >
              {etiquetaTonalidad(activa, m)}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
