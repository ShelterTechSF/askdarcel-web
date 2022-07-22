/**
 * Round numbers to a specified decimal place.
 *
 * E.g.
 * round(-122.312360, 4) -> -122.3124
 * round(33.102938, 2) -> -33.10
 */
export function round(value: number, decimals: number) {
  return Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`);
}
