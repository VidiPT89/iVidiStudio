"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { FLOORS } from "@/lib/floors";
import { useLang, useMessages } from "@/lib/preferences";
import { byPriority, STATES, type SimTicket } from "@/lib/simulation";
import { useLive } from "./live";
import { STATE_COLOR, TicketCard, TicketModal, useStateLabels } from "./ticket-ui";

const ROW_H = 60;

export function BuildingSection() {
  const t = useMessages();
  const [lang] = useLang();
  const reduce = useReducedMotion();
  const stateLabel = useStateLabels();
  const sim = useLive();

  // The elevator rides to wherever the latest step happened, unless the visitor picks a floor.
  const liveIndex = Math.max(0, FLOORS.findIndex((f) => f.slug === sim.liveFloor));
  const [picked, setPicked] = useState<number | null>(null);
  const [open, setOpen] = useState<SimTicket | null>(null);
  const selected = picked ?? liveIndex;

  const floor = FLOORS[selected];
  const activeOn = (slug: string) => {
    const c = sim.byFloor[slug];
    return c ? c.entrada + c["em-curso"] + c["aguarda-aprovacao"] : 0;
  };
  const floorTickets = sim.tickets.filter((tk) => tk.floor === floor.slug && tk.state !== "concluido").sort(byPriority);

  return (
    <section id="edificio" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionTitle title={t.buildingTitle} body={t.buildingBody} />

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* The tower */}
        <motion.div
          className="card relative overflow-hidden p-4 sm:p-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Roof />
          <div className="relative flex">
            {/* elevator shaft */}
            <div
              className="relative mr-3 w-10 shrink-0 rounded-lg border border-line bg-bg sm:mr-4"
              style={{ height: ROW_H * FLOORS.length }}
            >
              <div className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-line" />
              <motion.div
                className="bg-brand absolute left-1 right-1 rounded-md shadow-[0_0_24px_var(--glow)]"
                style={{ height: ROW_H - 12, top: 6 }}
                animate={{ y: selected * ROW_H }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 18, mass: 1.1 }}
              >
                <div className="absolute inset-x-1.5 top-1/2 h-px -translate-y-1/2 bg-[#0a0a0f]/30" />
                <div className="absolute inset-y-1.5 left-1/2 w-px -translate-x-1/2 bg-[#0a0a0f]/30" />
              </motion.div>
            </div>

            {/* floors */}
            <ul className="min-w-0 flex-1">
              {FLOORS.map((f, i) => {
                const c = sim.byFloor[f.slug];
                const isSel = i === selected;
                return (
                  <li
                    key={f.slug}
                    className={
                      f.level === -1
                        ? "relative before:absolute before:inset-x-0 before:top-0 before:border-t-2 before:border-dashed before:border-amber/50"
                        : ""
                    }
                  >
                    <button
                      type="button"
                      onClick={() => setPicked(i)}
                      aria-pressed={isSel}
                      className={`focus-ring group relative flex w-full items-center gap-3 rounded-lg px-3 text-left transition-colors ${
                        isSel ? "bg-surface-2" : "hover:bg-surface-2/60"
                      }`}
                      style={{ height: ROW_H }}
                    >
                      {isSel && (
                        <motion.span
                          layoutId="floor-sel"
                          className="absolute inset-y-2 left-0 w-1 rounded-full bg-orange"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="w-[4.5rem] shrink-0 font-mono text-xs text-muted">{f.label[lang]}</span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-sm font-medium transition-colors ${isSel ? "text-orange" : "group-hover:text-fg"}`}
                        >
                          {f.name[lang]}
                        </span>
                        <span className="hidden truncate text-xs text-muted sm:block">{f.mission[lang]}</span>
                      </span>
                      <Windows lit={activeOn(f.slug)} />
                      <span className="flex shrink-0 items-center gap-1">
                        {STATES.map((s) => (
                          <span
                            key={s}
                            title={`${stateLabel[s]}: ${c?.[s] ?? 0}`}
                            className="h-2 w-2 rounded-full transition-opacity duration-500"
                            style={{ background: STATE_COLOR[s], opacity: c?.[s] ? 1 : 0.18 }}
                          />
                        ))}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="bg-brand mt-3 h-1 rounded-full opacity-70" />
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            {STATES.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: STATE_COLOR[s] }} />
                {stateLabel[s]}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Floor detail */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <motion.div
            key={floor.slug}
            className="card p-6"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-amber">{floor.label[lang]}</p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight">{floor.name[lang]}</h3>
              </div>
              {picked !== null && (
                <button
                  type="button"
                  onClick={() => setPicked(null)}
                  className="focus-ring shrink-0 rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:border-orange hover:text-orange"
                >
                  {t.followElevator}
                </button>
              )}
            </div>

            <Label>{t.floorMission}</Label>
            <p className="text-sm leading-relaxed text-fg/85">{floor.mission[lang]}</p>

            <Label>{t.floorTeam}</Label>
            <div className="flex flex-wrap gap-1.5">
              {floor.agents.map((a) => (
                <span key={a} className="rounded-full border border-line bg-surface-2 px-2.5 py-1 font-mono text-[11px]">
                  {a}
                </span>
              ))}
            </div>

            <Label>{t.floorKpis}</Label>
            <ul className="divide-y divide-line text-sm">
              {floor.kpis.map((k) => (
                <li key={k.name.en} className="flex items-center justify-between gap-3 py-2">
                  <span className="text-fg/85">{k.name[lang]}</span>
                  <span className="shrink-0 font-mono text-xs text-amber">
                    {t.floorKpiTarget} {k.target}
                  </span>
                </li>
              ))}
            </ul>

            <Label>
              {t.floorWork}
              <span className="ml-2 font-mono normal-case tracking-normal text-muted/80">
                {t.floorTickets(floorTickets.length)}
              </span>
            </Label>
            {floorTickets.length ? (
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {floorTickets.slice(0, 4).map((tk) => (
                    <TicketCard key={tk.id} ticket={tk} onOpen={setOpen} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <p className="text-sm text-muted">{t.floorNoWork}</p>
            )}
          </motion.div>
        </div>
      </div>

      <TicketModal ticket={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function Windows({ lit }: { lit: number }) {
  return (
    <span className="hidden shrink-0 gap-1 md:flex" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`h-3.5 w-2.5 rounded-[3px] border transition-all duration-700 ${
            i < lit ? "bg-brand border-transparent shadow-[0_0_10px_var(--glow)]" : "border-line bg-bg"
          }`}
        />
      ))}
    </span>
  );
}

function Roof() {
  return (
    <div className="relative mb-3 flex items-end justify-center" aria-hidden>
      <div className="flex flex-col items-center">
        <span className="animate-blink h-2 w-2 rounded-full bg-orange shadow-[0_0_12px_var(--orange)]" />
        <span className="h-6 w-px bg-gold" />
        <span className="bg-brand rounded-md px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#0a0a0f]">
          iVidi Studio
        </span>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 mt-6 text-xs font-semibold uppercase tracking-widest text-muted">{children}</p>;
}

export function SectionTitle({ title, body }: { title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-muted">{body}</p>
    </motion.div>
  );
}
