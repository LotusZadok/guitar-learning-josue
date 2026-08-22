import { useState, useEffect, useCallback } from 'react';

interface ProcessAnimationState {
  currentStep: number; // 0 = idle, 1..maxSteps = process steps
  mode: 'idle' | 'playing' | 'paused';
  speed: 'normal' | 'slow';
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function useProcessAnimation(maxSteps: number) {
  const [state, setState] = useState<ProcessAnimationState>({
    currentStep: 0,
    mode: 'idle',
    speed: 'normal',
  });

  useEffect(() => {
    if (state.mode !== 'playing') return;
    // Todos los cambios de estado salen por el timer, nunca sincronos en el
    // cuerpo del efecto (react-hooks/set-state-in-effect). Con delay 0 el
    // salto al final sigue siendo inmediato en la practica.
    const done = state.currentStep >= maxSteps;
    const reduced = prefersReducedMotion();
    // `reduced` se re-evalua acá y no sólo en play(): cubre al usuario que
    // activa reduce-motion en el sistema con la animación ya corriendo.
    const ms = done || reduced ? 0 : state.speed === 'normal' ? 2000 : 4000;
    const timer = setTimeout(() => {
      setState(prev =>
        reduced
          ? { ...prev, currentStep: maxSteps, mode: 'paused' }
          : done
            ? { ...prev, mode: 'paused' }
            : { ...prev, currentStep: prev.currentStep + 1 },
      );
    }, ms);
    return () => clearTimeout(timer);
  }, [state.mode, state.currentStep, state.speed, maxSteps]);

  const play = useCallback(() => {
    if (prefersReducedMotion()) {
      setState(prev => ({ ...prev, currentStep: maxSteps, mode: 'paused' }));
      return;
    }
    setState(prev => {
      if (prev.currentStep === 0 || prev.currentStep >= maxSteps) {
        return { ...prev, currentStep: 1, mode: 'playing' };
      }
      return { ...prev, mode: 'playing' };
    });
  }, [maxSteps]);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, mode: 'paused' }));
  }, []);

  const goNext = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, maxSteps),
      mode: 'paused',
    }));
  }, [maxSteps]);

  const goPrev = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
      mode: 'paused',
    }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: 0, mode: 'idle' }));
  }, []);

  const setSpeed = useCallback((speed: 'normal' | 'slow') => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  return {
    currentStep: state.currentStep,
    mode: state.mode,
    speed: state.speed,
    maxSteps,
    play,
    pause,
    next: goNext,
    prev: goPrev,
    reset,
    setSpeed,
  };
}
