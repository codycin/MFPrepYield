{
  /*Entries component: Main component for the entry page. Utilizes browser 
    storage. Implemented input saftey. Helper functions for extra information.*/
}
import { useMemo, useState } from "react";
import { useEntriesContext } from "../Context/EntriesContext";
import { type Entry } from "../hooks/useEntries";
import { ozToG } from "../utils/units";
import { useUnit } from "../hooks/useUnits";
import UnitToggle from "./UnitToggle";
import { motion, AnimatePresence } from "framer-motion";

{
  /*Food type and list, plus helper functions for parsing and calculations*/
}
type Food = { id: string; name: string; note?: string };

//Parses a string to a positive number, returns NaN if invalid.
//Used for input fields to ensure only valid positive numbers are processed.
function parsePosNumber(s: string): number {
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

//Computes yield and related metrics from raw and cooked weights

function computeYield(raw: number, cooked: number) {
  const yieldFactor = cooked / raw;
  return {
    yieldFactor,
    yieldPct: yieldFactor * 100,
    lossPct: (1 - yieldFactor) * 100,
    cookedPerRaw: yieldFactor,
    rawPerCooked: raw / cooked,
    rawPer100Cooked: (raw / cooked) * 100,
  };
}
type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddEntry({ onClose, onSuccess }: Props) {
  //For entry local list
  const [, setEntries] = useEntriesContext();
  //For input strings
  const [foodId, setFoodId] = useState("");
  const [rawStr, setRawStr] = useState("");
  const [cookedStr, setCookedStr] = useState("");

  //List of foods
  const foods: Food[] = useMemo(
    () => [
      { id: "chicken_breast", name: "Chicken Breast" },
      { id: "chicken_thigh", name: "Chicken Thigh" },
      { id: "cod", name: "Cod" },

      { id: "ground_beef_80_20", name: "Ground Beef (80/20)" },
      { id: "ground_beef_85_15", name: "Ground Beef (85/15)" },
      { id: "ground_beef_90_10", name: "Ground Beef (90/10)" },
      { id: "ground_beef_93_7", name: "Ground Beef (93/7)" },
      { id: "ground_beef_96_4", name: "Ground Beef (96/4)" },
      { id: "ground_beef", name: "Ground Beef" },

      { id: "ground_chicken", name: "Ground Chicken" },

      { id: "ground_turkey_93_7", name: "Ground Turkey (93/7)" },
      { id: "ground_turkey_96_4", name: "Ground Turkey (96/4)" },
      { id: "ground_turkey", name: "Ground Turkey" },

      { id: "ham", name: "Ham" },
      { id: "noodles", name: "Noodles" },
      { id: "other", name: "Other" },

      { id: "pork_chop", name: "Pork Chop" },
      { id: "pork_loin", name: "Pork Loin" },
      { id: "pork_tenderloin", name: "Pork Tenderloin" },

      { id: "potato", name: "Potato" },
      { id: "rice", name: "Rice" },

      { id: "salmon", name: "Salmon" },
      { id: "shrimp", name: "Shrimp" },
      { id: "steak", name: "Steak" },
      { id: "sweet_potato", name: "Sweet Potato" },

      { id: "tilapia", name: "Tilapia" },
      { id: "tuna", name: "Tuna" },

      { id: "turkey_breast", name: "Turkey Breast" },
    ],
    [],
  );

  //For food search input
  const [foodQuery, setFoodQuery] = useState(
    foods.find((f) => f.id === foodId)?.name ?? "",
  );
  //For controlling food dropdown visibility
  const [foodOpen, setFoodOpen] = useState(false);

  //Filter foods based on search query, limit results for performance and usability
  const filteredFoods = useMemo(() => {
    const q = foodQuery.trim().toLowerCase();

    // When nothing is typed, show more items
    if (!q) {
      return foods.slice(0, 30);
    }

    // When searching, limit results
    return foods.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 8);
  }, [foodQuery, foods]);

  //Get the selected food object based on foodId, default to first food if not found
  const selectedFood = useMemo(() => {
    return foods.find((f) => f.id === foodId) ?? foods[0];
  }, [foods, foodId]);

  //Parse to numbers
  const rawWeight = parsePosNumber(rawStr);
  const cookedWeight = parsePosNumber(cookedStr);

  //Unit state and toggle, default to grams
  const { unit, setUnit } = useUnit("g");

  //Check selection validity and only update results when both are valid positive numbers
  const currentResults = useMemo(() => {
    if (!Number.isFinite(rawWeight) || !Number.isFinite(cookedWeight))
      return null;

    const rawG = unit === "g" ? rawWeight : ozToG(rawWeight);
    const cookedG = unit === "g" ? cookedWeight : ozToG(cookedWeight);

    if (!Number.isFinite(rawG) || !Number.isFinite(cookedG)) return null;
    return computeYield(rawG, cookedG);
  }, [rawWeight, cookedWeight, unit]);

  //Add a new entry to the list with computed results, then clear inputs
  const addEntry = () => {
    if (!Number.isFinite(rawWeight) || !Number.isFinite(cookedWeight)) return;

    const rawG = unit === "g" ? rawWeight : ozToG(rawWeight);
    const cookedG = unit === "g" ? cookedWeight : ozToG(cookedWeight);
    const { yieldPct } = computeYield(rawG, cookedG);

    const newEntry: Entry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      foodId,
      foodName: selectedFood.name,
      rawWeight: rawG,
      cookedWeight: cookedG,
      unit,
      yieldPct,
    };

    setEntries((prev) => [...prev, newEntry]);
    onSuccess?.(); // closes + refreshes parent if needed

    setRawStr("");
    setCookedStr("");
    setFoodQuery("");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      >
        {/* Modal Card */}
        <motion.div
          initial={{ y: 10, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="w-[95%] max-w-2xl bg-zinc-900 text-zinc-100 rounded-2xl shadow-xl border border-zinc-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <h1 className="text-lg font-semibold">Add Entry</h1>

            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white text-sm"
            >
              Cancel
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Food */}
              <div className="relative">
                <label className="text-xs text-zinc-400">Food</label>

                <input
                  className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  value={foodQuery}
                  placeholder="Search foods…"
                  onChange={(e) => {
                    setFoodQuery(e.target.value);
                    setFoodOpen(true);
                  }}
                  onFocus={() => setFoodOpen(true)}
                  onBlur={() => setTimeout(() => setFoodOpen(false), 120)}
                />

                {/* Dropdown */}
                {foodOpen && (
                  <div className="absolute z-10 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 shadow-lg">
                    {filteredFoods.length === 0 ? (
                      <div className="p-2 text-xs text-zinc-500">
                        No matches
                      </div>
                    ) : (
                      filteredFoods.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setFoodId(f.id);
                            setFoodQuery(f.name);
                            setFoodOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-800"
                        >
                          {f.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Raw */}
              <div>
                <label className="text-xs text-zinc-400">
                  Raw weight ({unit})
                </label>
                <input
                  className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  value={rawStr}
                  onChange={(e) => setRawStr(e.target.value)}
                />
              </div>

              {/* Cooked */}
              <div>
                <label className="text-xs text-zinc-400">
                  Cooked weight ({unit})
                </label>
                <input
                  className="mt-1 w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  value={cookedStr}
                  onChange={(e) => setCookedStr(e.target.value)}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={addEntry}
                disabled={!currentResults}
                className="px-3 py-2 rounded-xl bg-white text-black text-sm disabled:opacity-40"
              >
                Add entry
              </button>

              <button
                onClick={() => {
                  setRawStr("");
                  setCookedStr("");
                }}
                className="px-3 py-2 rounded-xl border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Clear inputs
              </button>
              <UnitToggle unit={unit} setUnit={setUnit} />
            </div>

            {/* Preview */}
            <div className="pt-2">
              {!currentResults ? (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-400">
                  Enter positive raw & cooked weights to preview results.
                </div>
              ) : (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm">
                  <div className="font-semibold text-zinc-200">Preview</div>
                  <div className="text-zinc-400">
                    Yield: {currentResults.yieldPct.toFixed(1)}% • Loss:{" "}
                    {currentResults.lossPct.toFixed(1)}% • Raw per 100g cooked:{" "}
                    {currentResults.rawPer100Cooked.toFixed(1)}g
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
