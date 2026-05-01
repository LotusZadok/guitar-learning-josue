import { useState, useEffect, useCallback } from 'react';

interface ProcessAnimationState {
  currentStep: number; // 0 = idle, 1..maxSteps = process steps
  mode: 'idle' | 'playing' | 'paused';
  speed: 'normal' | 'slow';
}

export function useProcessAnimation(maxSteps: number) {
  const [state, setState] = useState<ProcessAnimationState>({
    currentStep: 0,
    mode: 'idle',
    speed: 'normal',
  });

  useEffect(() => {
    if (state.mode !== 'playing') return;
    if (state.currentStep >= maxSteps) {
      setState(prev => ({ ...prev, mode: 'paused' }));
      return;
    }
    const ms = state.speed === 'normal' ? 2000 : 4000;
    const timer = setTimeout(() => {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }, ms);
    return () => clearTimeout(timer);
  }, [state.mode, state.currentStep, state.speed, maxSteps]);

  const play = useCallback(() => {
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
