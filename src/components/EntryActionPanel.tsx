import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { type Entry } from "../hooks/useEntries";
import { useEntriesContext } from "../Context/EntriesContext";

function parsePosNumber(s: string): number {
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

export default function EntryActionPanel({
  entry,
  onClose,
}: {
  entry: Entry | null;
  onClose: () => void;
}) {
  const [, setEntries] = useEntriesContext();
  const [amount, setAmount] = useState<string>("");

  if (!entry) return null;

  const yieldRate = entry.yieldPct / 100;
  const rawAmount = parsePosNumber(amount || "0");
  const cookedNeeded = Number.isFinite(rawAmount) ? rawAmount * yieldRate : 0;

  const useEntry = () => {
    const useAmount = parsePosNumber(amount);

    if (!Number.isFinite(useAmount) || useAmount <= 0) return;

    const newCooked = entry.cookedWeight - useAmount;

    setEntries((prev) =>
      prev
        .map((e) => (e.id === entry.id ? { ...e, cookedWeight: newCooked } : e))
        .filter((e) => e.cookedWeight > 0),
    );

    setAmount("");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-end justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        exit={{ y: 60 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-t-2xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-medium text-zinc-200 truncate">
            {entry.foodName}
          </div>

          <button onClick={onClose}>
            <X size={18} className="text-zinc-400" />
          </button>
        </div>

        <div className="bg-zinc-800/40 rounded-xl p-3 mb-4">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Yield</span>
            <span>Cooked Available</span>
          </div>

          <div className="flex justify-between mt-1 text-sm">
            <span>{entry.yieldPct.toFixed(1)}%</span>
            <span className="text-zinc-200">
              {entry.cookedWeight.toFixed(1)}g
            </span>
          </div>

          {/* LIVE CONVERSION PREVIEW */}
          <div className="mt-2 text-xs text-zinc-400 flex justify-between">
            <span>Raw input</span>
            <span>Cooked needed</span>
          </div>

          <div className="flex justify-between text-sm mt-1">
            <span>{rawAmount || 0}g</span>
            <span className="text-blue-400">{cookedNeeded.toFixed(1)}g</span>
          </div>
        </div>

        {/* AMOUNT PICKER */}
        <div>
          <label className="text-xs text-zinc-400">Amount</label>
          <div className="flex mt-1">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="flex-1 bg-zinc-900 h-11 px-3 rounded-l-xl focus:outline-none focus:ring-1 focus:ring-zinc-600"
            />
            <div className="bg-zinc-900 px-2 h-11 flex items-center rounded-r-xl text-xs text-zinc-400">
              g
            </div>
          </div>
        </div>

        {/* PRIMARY ACTION */}
        <button
          onClick={useEntry}
          className="w-full py-3 rounded-xl bg-blue-500 text-white text-sm font-medium mt-5"
        >
          Use {amount || 0}g
        </button>
      </motion.div>
    </motion.div>
  );
}
