
import { useLocalStorageState } from "./useLocalStorageState";
export type Entry = {
  id: string;
  createdAt: string;
  foodId: string;
  foodName: string;
  rawWeight: number;
  cookedWeight: number;
  unit?: string;
  yieldPct: number;
};

const STORAGE_KEY = "rwcalc.entries.v1";

export function useEntries() {
  const [entries, setEntries] = useLocalStorageState<Entry[]>(
    STORAGE_KEY,
    []
  );

  return [entries, setEntries] as const;
}