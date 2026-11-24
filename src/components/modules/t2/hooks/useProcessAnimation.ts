import { useState, useEffect, useCallback } from 'react';
import { estadoAlIniciar, estadoTrasTick, type EstadoProceso } from '../../../../utils/procesos';

export function useProcessAnimation(maxSteps: number) {
  const [state, setState] = useState<EstadoProceso>({
    currentStep: 0,
    mode: 'idle',
    speed: 'normal',
  });

  useEffect(() => {
    if (state.mode !== 'playing') return;
    // Todos los cambios de estado salen por el timer, nunca sincronos en el
    // cuerpo del efecto (react-hooks/set-state-in-effect).
    const done = state.currentStep >= maxSteps;
    const ms = done ? 0 : state.speed === 'normal' ? 2000 : 4000;
    const timer = setTimeout(() => {
      setState(prev => estadoTrasTick(prev, maxSteps));
    }, ms);
    return () => clearTimeout(timer);
  }, [state.mode, state.currentStep, state.speed, maxSteps]);

  const play = useCallback(() => {
    setState(prev => estadoAlIniciar(prev, maxSteps));
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
