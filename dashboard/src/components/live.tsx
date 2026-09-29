"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { simulate, type Simulation } from "@/lib/simulation";

// One clock for the whole page: the simulation is recomputed once per second,
// and not at all while the tab is hidden (it catches up the moment it is shown).
const subscribe = (tick: () => void) => {
  const id = setInterval(() => {
    if (!document.hidden) tick();
  }, 1000);
  document.addEventListener("visibilitychange", tick);
  return () => {
    clearInterval(id);
    document.removeEventListener("visibilitychange", tick);
  };
};
const nowToSecond = () => Math.floor(Date.now() / 1000) * 1000;
// The page is prerendered: the server renders an empty building and the browser fills it in.
const serverNow = () => null;

const EMPTY: Simulation = {
  now: 0,
  tickets: [],
  recent: [],
  liveFloor: "00-rececao",
  byFloor: {},
  byState: { entrada: 0, "em-curso": 0, "aguarda-aprovacao": 0, concluido: 0 },
  requestsToday: 0,
  doneToday: 0,
};

const LiveContext = createContext<Simulation>(EMPTY);

export const useLive = () => useContext(LiveContext);

export function LiveProvider({ children }: { children: ReactNode }) {
  const now = useSyncExternalStore(subscribe, nowToSecond, serverNow);
  const sim = useMemo(() => (now === null ? EMPTY : simulate(now)), [now]);
  return <LiveContext.Provider value={sim}>{children}</LiveContext.Provider>;
}
