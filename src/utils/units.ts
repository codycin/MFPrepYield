//Utility functions for unit conversions and formatting.
export type Unit = "g" | "oz";

const G_PER_OZ = 28.349523125;

export function gToOz(g: number): number {
  return g / G_PER_OZ;
}

export function ozToG(oz: number): number {
  return oz * G_PER_OZ;
}

export function formatAmount(value: number, digits = 1): string {
  return Number.isFinite(value) ? value.toFixed(digits) : "—";
}