// Transiciones puras de los procesos paso a paso (useProcessAnimation).
// Con prefers-reduced-motion los pasos NO se saltan: son contenido, no
// decoración, y cada paso hace sonar su nota (reunión 22/11/26, #14). Lo que
// reduce-motion neutraliza son las transiciones CSS, vía el reset de global.css.

export interface EstadoProceso {
  currentStep: number; // 0 = idle, 1..maxSteps = process steps
  mode: 'idle' | 'playing' | 'paused';
  speed: 'normal' | 'slow';
}

export function estadoAlIniciar(prev: EstadoProceso, maxSteps: number): EstadoProceso {
  const desdeElInicio = prev.currentStep === 0 || prev.currentStep >= maxSteps;
  return { ...prev, currentStep: desdeElInicio ? 1 : prev.currentStep, mode: 'playing' };
}

export function estadoTrasTick(prev: EstadoProceso, maxSteps: number): EstadoProceso {
  return prev.currentStep >= maxSteps
    ? { ...prev, mode: 'paused' }
    : { ...prev, currentStep: prev.currentStep + 1 };
}
