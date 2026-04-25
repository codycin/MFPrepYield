import { useState } from "react";
import { useEntriesContext } from "../Context/EntriesContext";
import { gToOz } from "../utils/units";
import { motion, AnimatePresence } from "framer-motion";
import EntryActionPanel from "./EntryActionPanel";
import AddEntry from "./AddEntry";
import type { Entry } from "../hooks/useEntries";

export default function Entries() {
  const [entries, setEntries] = useEntriesContext();

  const [activeEntry, setActiveEntry] = useState<Entry | null>(null);
  const [showAddEntry, setShowAddEntry] = useState(false);

  const deleteEntry = (id: string) => {
    setEntries((prev: Entry[]) => prev.filter((e) => e.id !== id));
  };

  return (
    <>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 pt-6">
        <div className="mb-4">
          <h1 className="text-lg font-semibold">Entries</h1>
          <p className="text-xs text-zinc-500">{entries.length} items logged</p>
        </div>

        <div className="mt-2 divide-y divide-zinc-800">
          {entries.map((e: Entry) => {
            const entryUnit = e.unit ?? "g";
            const cookedDisplay =
              entryUnit === "g" ? e.cookedWeight : gToOz(e.cookedWeight);

            return (
              <div key={e.id} className="relative overflow-hidden">
                <div className="absolute inset-0 flex items-center pr-3">
                  <button
                    onClick={() => deleteEntry(e.id)}
                    className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white"
                  >
                    ✕
                  </button>
                </div>

                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 80 }}
                  dragElastic={0.2}
                  className="relative z-10 bg-zinc-950 flex items-center justify-between py-4 px-1"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center">
                      🍽️
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {e.foodName}
                      </div>

                      <div className="text-xs text-zinc-500 flex gap-2">
                        <span>
                          {cookedDisplay.toFixed(1)}
                          {entryUnit}
                        </span>

                        <span>•</span>

                        <span>
                          {new Date(e.createdAt).toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveEntry(e)}
                    className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700"
                  >
                    +
                  </button>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setShowAddEntry(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-zinc-800 text-white text-2xl shadow-lg flex items-center justify-center"
      >
        +
      </button>

      <AnimatePresence>
        {activeEntry && (
          <EntryActionPanel
            entry={activeEntry}
            onClose={() => setActiveEntry(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 10, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-[95%] max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-3"
            >
              <AddEntry
                onClose={() => setShowAddEntry(false)}
                onSuccess={() => setShowAddEntry(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
