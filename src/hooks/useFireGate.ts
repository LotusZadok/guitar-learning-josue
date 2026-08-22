import { useCallback, useRef } from "react";

// Gate for scrub/click handlers that can re-fire faster than a note should
// retrigger. Call the returned function before playing; it returns `true` at
// most once per `intervalMs`.
export function useFireGate(intervalMs = 150) {
  const last = useRef(0);
  return useCallback(() => {
    const now = performance.now();
    if (now - last.current < intervalMs) return false;
    last.current = now;
    return true;
  }, [intervalMs]);
}
