"use client";

import { useSyncExternalStore } from "react";
import { building } from "./building";

// The page is prerendered at build time, so anything that depends on "now" must be
// read in the browser. useSyncExternalStore renders the server value during hydration
// and then swaps in the browser value, instead of freezing the build-time text.
const noop = () => () => {};

export type DayPeriod = "morning" | "afternoon" | "evening";

function periodNow(): DayPeriod {
  const h = new Date().getHours();
  if (h >= 5 && h < 13) return "morning";
  if (h >= 13 && h < 20) return "afternoon";
  return "evening";
}

/** Morning / afternoon / evening in the visitor's timezone; null while prerendering. */
export const useDayPeriod = () => useSyncExternalStore(noop, periodNow, () => null);

const todayNow = () => new Date().toISOString().slice(0, 10);

/** Today's date (YYYY-MM-DD); the snapshot date while prerendering. */
export const useToday = () => useSyncExternalStore(noop, todayNow, () => building.generatedAt.slice(0, 10));
