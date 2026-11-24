// Transiciones puras de los procesos paso a paso (useProcessAnimation).
// Con prefers-reduced-motion los pasos NO se saltan: son contenido, no
// decoración, y cada paso hace sonar su nota (reunión 22/11/26, #14). Lo que
// reduce-motion neutraliza son las transiciones CSS, vía el reset de global.css.

// §1.7: el camino que muestra el árbol en cada paso del recorrido. El paso 1
// (la tónica) conserva la tercera y la quinta elegidas: antes devolvía [] y el
// árbol "se reiniciaba desde la tónica" (reunión 22/11/26, #20). En reposo
// (paso 0) el árbol queda libre para que el estudiante elija.
export function caminoPorPaso(paso: number, tercera: string, quinta: string): string[] | undefined {
  if (paso === 0) return undefined;
  return paso === 2 ? [tercera] : [tercera, quinta];
}

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
