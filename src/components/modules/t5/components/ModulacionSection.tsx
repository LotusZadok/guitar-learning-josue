import { useTranslation } from 'react-i18next';
import SectionLabel from '../../../shared/SectionLabel';
import PlaybackButton from '../../../shared/PlaybackButton/PlaybackButton';
import GrillaProgresion from '../../../primitives/GrillaProgresion/GrillaProgresion';
import { useProgressionPlayback } from '../../../../hooks/useProgressionPlayback';
import type { Grid, GradoId, Tonalidad } from '../../../../utils/progresionArmonica';
import styles from './ModulacionSection.module.css';

// 5.3 · Modulación (borrador del 19/10/26). El ejemplo sonoro es el que armó el
// profesor en el laboratorio: Sol mayor que pasa a La mayor (reunión 19/10/26,
// 01:27:49). Los acordes de cada tramo son míos: I-IV-V en Sol y el ii-V-I de La,
// que prepara la tonalidad nueva como explica el texto.
const SOL: Tonalidad = { armaduraId: 'G', modo: 'mayor' };
const LA: Tonalidad = { armaduraId: 'A', modo: 'mayor' };
const COMPASES = 6;
const PULSOS = 4;

const acorde = (degree: GradoId, tonalidad: Tonalidad, septima = false) => ({ degree, tonalidad, septima });
const PROGRESION = [
  acorde('I', SOL), acorde('IV', SOL), acorde('V', SOL),
  acorde('ii', LA), acorde('V', LA, true), acorde('I', LA),
];
// Un acorde por compás, en el primer pulso.
const GRILLA: Grid = Array.from({ length: COMPASES * PULSOS }, (_, i) =>
  i % PULSOS === 0 ? PROGRESION[i / PULSOS] : null,
);

const nada = () => {};

export default function ModulacionSection() {
  const { t } = useTranslation();
  const { reproduciendo, sonando, play, stop } = useProgressionPlayback({
    grid: GRILLA,
    compas: '4/4',
    bpm: 80,
    repeticion: null,
    metronomo: false,
    loop: false,
  });

  return (
    <section id="s-t5-modulacion" className={styles.section}>
      <SectionLabel text={t('t4.s53.label')} />
      <h2>{t('t4.s53.title')}</h2>

      <p className={styles.text}>{t('t4.s53.tonizacion')}</p>
      <p className={styles.text}>{t('t4.s53.resumen')}</p>
      <p className={styles.text}>{t('t4.s53.jazz')}</p>
      <p className={styles.text}>{t('t4.s53.maneras')}</p>
      <p className={styles.text}>{t('t4.s53.reconocer')}</p>

      <p className={styles.text}>{t('t4.s53.ejemplo')}</p>
      <div className={styles.ejemplo}>
        <PlaybackButton
          mode="bloque"
          label={t('t4.s53.play')}
          playing={reproduciendo}
          onClick={reproduciendo ? stop : play}
        />
        <div className={styles.grilla}>
          <GrillaProgresion
            soloLectura
            grid={GRILLA}
            compas="4/4"
            nCompases={COMPASES}
            sonando={sonando}
            hayGradoArmado={false}
            modificadorArmado={null}
            onModificar={nada}
            etiquetaModificar={() => ''}
            onColocar={nada}
            onVaciar={nada}
            onSoltar={nada}
            etiquetaModulacion={(tonalidad) => t('t4.s41.casilla_tonalidad', { tonalidad })}
            etiquetaCasilla={(_, datos) =>
              datos.acorde ? t('t4.s53.casilla', datos) : t('t4.s41.casilla_vacia', datos)
            }
            repeticion={{
              tramo: null,
              armada: null,
              onMarcar: nada,
              onQuitar: nada,
              etiquetaMarcar: () => '',
              etiquetaBarra: () => '',
            }}
          />
        </div>
      </div>

      <p className={styles.text}>{t('t4.s53.laboratorio')}</p>
    </section>
  );
}
