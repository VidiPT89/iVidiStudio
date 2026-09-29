"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { building, byPriority, daysBetween, STATES, type Ticket } from "@/lib/building";
import { useMessages } from "@/lib/preferences";
import { SectionTitle } from "./building";
import { ArrowUpRightIcon, HandIcon } from "./icons";
import { PriorityBadge, STATE_COLOR, TicketCard, TicketModal, useFloorName, useStateLabels } from "./ticket-ui";

const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
});

export function ElevatorBoard() {
  const t = useMessages();
  const stateLabel = useStateLabels();
  const [open, setOpen] = useState<Ticket | null>(null);

  return (
    <section id="elevador" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionTitle title={t.elevatorTitle} body={t.elevatorBody} />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATES.map((state, col) => {
          const tickets = building.tickets.filter((tk) => tk.state === state).sort(byPriority);
          return (
            <motion.div key={state} className="rounded-[1.25rem] border border-line bg-surface-2/50 p-3" {...reveal(col)}>
              <div className="flex items-center justify-between px-1 pb-3 pt-1">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATE_COLOR[state] }} />
                  {stateLabel[state]}
                </span>
                <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-xs text-muted">{tickets.length}</span>
              </div>
              <div className="space-y-2">
                {tickets.length ? (
                  tickets.map((tk) => <TicketCard key={tk.id} ticket={tk} onOpen={setOpen} />)
                ) : (
                  <p className="rounded-xl border border-dashed border-line py-8 text-center text-xs text-muted">{t.emptyColumn}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <TicketModal ticket={open} onClose={() => setOpen(null)} />
    </section>
  );
}

export function Approvals() {
  const t = useMessages();
  const floorName = useFloorName();
  const [open, setOpen] = useState<Ticket | null>(null);
  const pending = building.tickets.filter((tk) => tk.state === "aguarda-aprovacao").sort(byPriority);
  // Ages are measured against the data snapshot, so server and browser agree.
  const asOf = building.generatedAt.slice(0, 10);

  return (
    <section id="aprovacoes" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionTitle title={t.approvalsTitle} body={t.approvalsBody} />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {pending.length === 0 && (
          <p className="card p-8 text-center text-muted md:col-span-2">{t.approvalsEmpty}</p>
        )}
        {pending.map((tk, i) => {
          const days = daysBetween(tk.updated, asOf);
          return (
            <motion.button
              key={tk.id}
              type="button"
              onClick={() => setOpen(tk)}
              className="card focus-ring group relative overflow-hidden p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-orange/60"
              {...reveal(i)}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle at 0% 0%, var(--glow), transparent 55%)" }}
              />
              <div className="relative flex items-start gap-4">
                <span className="bg-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#0a0a0f]">
                  <HandIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="font-mono">{tk.id}</span>
                    <PriorityBadge priority={tk.priority} />
                    <span className={days > 2 ? "font-semibold text-bad" : ""}>{t.waitingDays(days)}</span>
                  </div>
                  <p className="mt-1.5 font-medium leading-snug">{tk.title}</p>
                  {tk.approvalAction && (
                    <p className="mt-2 text-sm text-muted">
                      <span className="text-orange">{t.approvalAction}:</span> {tk.approvalAction}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-muted">{floorName(tk.floor)}</p>
                </div>
                <ArrowUpRightIcon className="relative shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange" />
              </div>
            </motion.button>
          );
        })}
      </div>
      <TicketModal ticket={open} onClose={() => setOpen(null)} />
    </section>
  );
}

type SiteStatus = { name: string; url: string; up: boolean; ms: number | null };

export function ActivityAndStatus() {
  const t = useMessages();
  const floorName = useFloorName();
  const [sites, setSites] = useState<SiteStatus[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/status")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { sites: SiteStatus[] }) => alive && setSites(data.sites))
      .catch(() => alive && setSites([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section id="atividade" className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div>
        <SectionTitle title={t.activityTitle} body={`${t.snapshot} ${building.generatedAt.slice(0, 16).replace("T", " ")} UTC`} />
        <ol className="mt-8 space-y-3">
          {building.recent.length === 0 && <p className="text-muted">{t.activityEmpty}</p>}
          {building.recent.map((r, i) => (
            <motion.li key={`${r.floor}/${r.file}`} className="card flex items-center gap-4 p-4" {...reveal(i)}>
              <span className="w-24 shrink-0 font-mono text-xs text-muted">{r.date || "—"}</span>
              <span className="min-w-0 flex-1 truncate text-sm">{r.title}</span>
              <span className="hidden shrink-0 rounded-full border border-line px-2.5 py-0.5 text-xs text-muted sm:inline">
                {floorName(r.floor)}
              </span>
            </motion.li>
          ))}
        </ol>
      </div>

      <div>
        <SectionTitle title={t.statusTitle} body="ividi.dev · portal.ividi.dev" />
        <div className="card mt-8 divide-y divide-line">
          {(sites ?? [
            { name: "ividi.dev", url: "https://ividi.dev", up: false, ms: null },
            { name: "portal.ividi.dev", url: "https://portal.ividi.dev", up: false, ms: null },
          ]).map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="focus-ring group flex items-center gap-3 p-4 transition-colors hover:bg-surface-2/60"
            >
              <span className="relative flex h-2.5 w-2.5">
                {sites && s.up && <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-ok" />}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${!sites ? "bg-muted animate-blink" : s.up ? "bg-ok" : "bg-bad"}`}
                />
              </span>
              <span className="flex-1 text-sm font-medium group-hover:text-orange">{s.name}</span>
              <span className="font-mono text-xs text-muted">
                {!sites ? t.statusChecking : s.up ? `${t.statusUp}${s.ms !== null ? ` · ${s.ms} ms` : ""}` : t.statusDown}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
