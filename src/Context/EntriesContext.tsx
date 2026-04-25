import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { type Entry } from "../hooks/useEntries";

const STORAGE_KEY = "rwcalc.entries.v1";

interface EntriesContextType {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}

const EntriesContext = createContext<EntriesContextType | undefined>(undefined);

export function EntriesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useLocalStorageState<Entry[]>(STORAGE_KEY, []);

  return (
    <EntriesContext.Provider value={{ entries, setEntries }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntriesContext() {
  const context = useContext(EntriesContext);
  if (!context) {
    throw new Error("useEntriesContext must be used within an EntriesProvider");
  }
  return [context.entries, context.setEntries] as const;
}
