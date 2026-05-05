import type { ProcessStepData } from '../data/processSteps';
import ScaleDisplay from './ScaleDisplay';
import styles from './ProcessPanel.module.css';

interface Props {
  titulo: string;
  steps: ProcessStepData[];
  currentStep: number; // 0 = idle, 1+ = active step
}

export default function ProcessPanel({ titulo, steps, currentStep }: Props) {
  const activeStep = currentStep > 0 ? steps[currentStep - 1] : null;

  return (
    <div className={styles.panel}>
      <h3 className={styles.titulo}>{titulo}</h3>

      <div className={styles.steps}>
        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isPast = stepNum < currentStep;
          return (
            <div
              key={i}
              className={`${styles.step} ${isActive ? styles.stepActive : ''} ${isPast ? styles.stepPast : ''}`}
            >
              {step.description}
            </div>
          );
        })}
      </div>

      {activeStep && activeStep.armaduraDisplay.length > 0 && (
        <ScaleDisplay notes={activeStep.armaduraDisplay} label="Armadura" />
      )}

      {activeStep && activeStep.scaleDisplay.length > 0 && (
        <ScaleDisplay notes={activeStep.scaleDisplay} label="Escala" />
      )}
    </div>
  );
}
