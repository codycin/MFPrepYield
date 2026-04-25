//Custom hook for managing the selected unit (grams or ounces) in local storage
import { useEffect, useState } from "react";
import type { Unit } from "../utils/units";

const KEY = "prepyield.unit";

export function useUnit(defaultUnit: Unit = "g") {
  const [unit, setUnit] = useState<Unit>(() => {
    const saved = localStorage.getItem(KEY);
    return saved === "g" || saved === "oz" ? saved : defaultUnit;
  });

  useEffect(() => {
    localStorage.setItem(KEY, unit);
  }, [unit]);

  return { unit, setUnit };
}