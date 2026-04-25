//UnitToggle component for switching between grams and ounces.
//Also accounts for dark mode
import type { Unit } from "../utils/units";

type UnitToggleProps = {
  unit: Unit;
  setUnit: (u: Unit) => void;
};

export default function UnitToggle({ unit, setUnit }: UnitToggleProps) {
  return (
    <button
      type="button"
      className="px-3 py-2 rounded-xl border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-800"
      onClick={() => setUnit(unit === "g" ? "oz" : "g")}
    >
      {unit === "g" ? "g" : "oz"}
    </button>
  );
}
