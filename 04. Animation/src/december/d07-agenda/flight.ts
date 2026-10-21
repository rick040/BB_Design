import { BLOCK_H, colLeft, BLOCK_W, slotTop } from "./WeekCard";
import type { AgendaProps } from "./schema";

// Het zorgpremie-blokje wordt in de hook weggeduwd en valt in de volgende
// scène op Buddy. Beide scènes rekenen met dezelfde baan, zodat het blokje
// over de overgang heen soepel doorvliegt.

/** Frames tussen het wegduwen en het begin van de volgende scène (de scène-overgang valt hier doorheen). */
export const IMPACT_BEFORE_CUT = 10;
export const FLIGHT_LEN = 24; // frames tussen duw en landen op Buddy
export const BUDDY_SIZE = 150;
export const BUDDY_FEET = 900;

export const flight = (premium: AgendaProps["week"]["premium"], buddyRatio: number) => {
  const x0 = colLeft(premium.day) + BLOCK_W / 2;
  const y0 = slotTop(premium.slot) + BLOCK_H / 2;
  // Het blokje komt op Buddy's kop terecht.
  const yEnd = BUDDY_FEET - BUDDY_SIZE * buddyRatio - BLOCK_H / 2 + 8;
  const vy = -8;
  const g = (2 * (yEnd - y0 - vy * FLIGHT_LEN)) / (FLIGHT_LEN * FLIGHT_LEN);
  const pos = (t: number) => ({
    x: x0 + Math.sin(Math.min(t, FLIGHT_LEN) / 6) * 8,
    y: y0 + vy * t + 0.5 * g * t * t,
    r: Math.min(t, FLIGHT_LEN) * 1.6,
  });
  return { x0, y0, yEnd, pos };
};
