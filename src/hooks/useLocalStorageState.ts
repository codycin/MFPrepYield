import { useEffect, useState } from "react";

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // WRITE to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  // 🔥 CRITICAL FIX: sync across tab + external updates
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key !== key) return;

      try {
        setState(e.newValue ? JSON.parse(e.newValue) : initialValue);
      } catch {}
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [key, initialValue]);

  return [state, setState] as const;
}