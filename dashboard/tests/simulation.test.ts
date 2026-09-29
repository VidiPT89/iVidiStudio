import { describe, expect, it } from "vitest";
import { FLOORS } from "@/lib/floors";
import { SLOT_MS, STATES, simulate, ticketForSlot } from "@/lib/simulation";

const NOW = Date.parse("2026-09-29T14:03:27Z");
const FLOOR_SLUGS = new Set(FLOORS.map((f) => f.slug));

describe("simulate", () => {
  it("shows every visitor the same building at the same moment", () => {
    expect(simulate(NOW)).toEqual(simulate(NOW));
  });

  it("keeps the counters consistent with the tickets on screen", () => {
    for (let i = 0; i < 50; i++) {
      const sim = simulate(NOW + i * 1000);
      const total = STATES.reduce((n, s) => n + sim.byState[s], 0);
      expect(total).toBe(sim.tickets.length);
      const perFloor = Object.values(sim.byFloor).reduce((n, c) => n + STATES.reduce((m, s) => m + c[s], 0), 0);
      expect(perFloor).toBe(sim.tickets.length);
      expect(sim.doneToday).toBeLessThanOrEqual(sim.requestsToday);
    }
  });

  it("is busy but not crowded", () => {
    const sizes = Array.from({ length: 200 }, (_, i) => simulate(NOW + i * 37_000).tickets.length);
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(5);
    expect(Math.max(...sizes)).toBeLessThanOrEqual(60);
  });

  it("only shows what already happened", () => {
    const sim = simulate(NOW);
    for (const t of sim.tickets) {
      expect(t.created).toBeLessThanOrEqual(NOW);
      expect(t.history.every((e) => e.time <= NOW)).toBe(true);
    }
    expect(sim.recent.every((e, i, all) => i === 0 || all[i - 1].time >= e.time)).toBe(true);
  });

  it("keeps the elevator on a floor for at least four seconds", () => {
    const start = NOW - (NOW % 4000);
    const floors = new Set([0, 1000, 2000, 3000].map((d) => simulate(start + d).liveFloor));
    expect(floors.size).toBe(1);
  });
});

describe("ticketForSlot", () => {
  const slots = Array.from({ length: 500 }, (_, i) => Math.floor(NOW / SLOT_MS) + i);

  it("walks every ticket through the building in order", () => {
    const order = { entrada: 0, "em-curso": 1, "aguarda-aprovacao": 2, concluido: 3 };
    for (const slot of slots) {
      const { events, doneAt } = ticketForSlot(slot);
      expect(events[0]).toMatchObject({ state: "entrada", floor: "00-rececao" });
      expect(events.at(-1)!.state).toBe("concluido");
      expect(events.at(-1)!.time).toBe(doneAt);
      for (let i = 1; i < events.length; i++) {
        expect(events[i].time).toBeGreaterThan(events[i - 1].time);
        expect(order[events[i].state]).toBeGreaterThanOrEqual(order[events[i - 1].state]);
      }
      expect(events.every((e) => FLOOR_SLUGS.has(e.floor))).toBe(true);
    }
  });

  it("never finishes a real-impact action without going through the human gate", () => {
    for (const slot of slots) {
      const { events, approvalAction } = ticketForSlot(slot);
      const gated = events.some((e) => e.state === "aguarda-aprovacao");
      expect(gated).toBe(approvalAction !== null);
    }
  });

  it("writes every title and step in both languages", () => {
    for (const slot of slots) {
      const { title, events } = ticketForSlot(slot);
      expect(title.pt && title.en).toBeTruthy();
      expect(events.every((e) => e.action.pt && e.action.en)).toBe(true);
    }
  });

  it("numbers tickets per day", () => {
    const first = ticketForSlot(Math.ceil(Date.parse("2026-09-29T00:00:00Z") / SLOT_MS));
    expect(first.id).toBe("T-20260929-00001");
  });
});

describe("real products", () => {
  const titles = Array.from({ length: 3000 }, (_, i) => ticketForSlot(i).title);

  it("uses the apps' real names, as on GitHub and in the stores", () => {
    const all = titles.flatMap((t) => [t.pt, t.en]).join("\n");
    for (const name of ["iSudoku", "iSueca", "iSolitaire", "iMahjong", "iPetanque", "PhotographersPocketKnife"]) {
      expect(all).toContain(name);
    }
    // Old placeholder names from the first prompt must never come back.
    expect(all).not.toMatch(/\b(Sudoku|Sueca|Solitário|Mahjong|Petanca|LiveShot)\b/);
  });
});
