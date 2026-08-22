import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Tonalidad } from '../data/tonalidades';
import { getProcessSteps, getIdleCircle } from '../data/processSteps';
import { useProcessAnimation } from '../hooks/useProcessAnimation';
import ToggleSwitch from '../../../shared/ToggleSwitch';
import ChromaticCircleAnimated from './ChromaticCircleAnimated';
import ProcessPanel from './ProcessPanel';
import ProcessControls from '../../../shared/ProcessControls/ProcessControls';
import AudioButtons from './AudioButtons';
import FExceptionBanner from './FExceptionBanner';
import styles from './ProcesoView.module.css';

interface Props {
  tonalidad: Tonalidad;
  compact?: boolean;
}

export default function ProcesoView({ tonalidad, compact }: Props) {
  const { i18n } = useTranslation();
  const isDe = i18n.language === 'de';
  const [dirRight, setDirRight] = useState(false);
  const isException = tonalidad.esExcepcion;
  // La excepción de F sólo existe de izquierda a derecha, así que fuerza la
  // dirección en render en vez de corregirla con un efecto después de haber
  // renderizado una vez en la dirección equivocada.
  const direction = dirRight && !isException ? 'der' : 'izq';

  const steps = useMemo(
    () => getProcessSteps(tonalidad, direction, isDe ? 'de' : 'es'),
    [tonalidad, direction, isDe]
  );
  const maxSteps = steps.length;

  const anim = useProcessAnimation(maxSteps);

  // Reset animation when tonalidad or direction changes
  useEffect(() => {
    anim.reset();
  }, [tonalidad.id, direction]); // eslint-disable-line react-hooks/exhaustive-deps

  const circleNotes = anim.currentStep === 0
    ? getIdleCircle(tonalidad)
    : steps[anim.currentStep - 1].circleNotes;

  const arrow = anim.currentStep > 0
    ? steps[anim.currentStep - 1].arrow
    : undefined;

  const titulo = direction === 'izq'
    ? (isDe ? 'Wie ermittelt man die Vorzeichen ausgehend von der Tonart?' : '¿Cómo saber la armadura partiendo de la tonalidad?')
    : (isDe ? 'Wie ermittelt man die Tonart ausgehend von den Vorzeichen?' : '¿Cómo saber la tonalidad partiendo de la armadura?');

  const closingText = anim.currentStep === maxSteps
    ? steps[maxSteps - 1].closingText
    : undefined;

  const audioEnabled = anim.currentStep === maxSteps;

  return (
    <div className={styles.wrap}>
      {/* Direction toggle */}
      <div className={styles.dirToggle}>
        <span className={!dirRight ? styles.dirActive : styles.dirLabel}>
          {isDe ? 'Tonart → Vorzeichen' : 'Tonalidad → Armadura'}
        </span>
        <ToggleSwitch
          label=""
          on={dirRight}
          onToggle={() => !isException && setDirRight(v => !v)}
        />
        <span className={`${dirRight ? styles.dirActive : styles.dirLabel} ${isException ? styles.dirDisabled : ''}`}>
          {isDe ? 'Vorzeichen → Tonart' : 'Armadura → Tonalidad'}
        </span>
      </div>

      {/* F exception banner */}
      {isException && <FExceptionBanner />}

      {/* Circle + Panel layout */}
      <div className={styles.layout}>
        <ChromaticCircleAnimated
          notes={circleNotes}
          arrow={arrow}
          compact={compact}
        />
        <ProcessPanel
          titulo={titulo}
          steps={steps}
          currentStep={anim.currentStep}
        />
      </div>

      {/* Controls */}
      <ProcessControls
        currentStep={anim.currentStep}
        maxSteps={maxSteps}
        mode={anim.mode}
        speed={anim.speed}
        onPlay={anim.play}
        onPause={anim.pause}
        onNext={anim.next}
        onPrev={anim.prev}
        onSpeedChange={anim.setSpeed}
      />

      {/* Audio buttons */}
      <AudioButtons
        escala={tonalidad.escala}
        tonica={tonalidad.tonica}
        disabled={!audioEnabled}
      />

      {/* Closing text */}
      {closingText && (
        <div className={styles.closing}>
          <p>{closingText}</p>
        </div>
      )}
    </div>
  );
}
