"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useLang, useMessages } from "@/lib/preferences";
import { byPriority, STATES, type SimTicket } from "@/lib/simulation";
import { SectionTitle } from "./building";
import { HandIcon } from "./icons";
import { useLive } from "./live";
import {
  PriorityBadge,
  STATE_COLOR,
  TicketCard,
  TicketModal,
  useFloorName,
  useSecondsAgo,
  useStateLabels,
} from "./ticket-ui";

export function ElevatorBoard() {
  const t = useMessages();
  const stateLabel = useStateLabels();
  const sim = useLive();
  const [open, setOpen] = useState<SimTicket | null>(null);

  return (
    <section id="elevador" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionTitle title={t.elevatorTitle} body={t.elevatorBody} />
      {/* One layout group, so a card glides to its new column when the ticket changes state. */}
      <LayoutGroup id="board">
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATES.map((state) => {
            const tickets = sim.tickets.filter((tk) => tk.state === state).sort(byPriority);
            return (
              <div key={state} className="rounded-[1.25rem] border border-line bg-surface-2/50 p-3">
                <div className="flex items-center justify-between px-1 pb-3 pt-1">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATE_COLOR[state] }} />
                    {stateLabel[state]}
                  </span>
                  <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-xs text-muted">{tickets.length}</span>
                </div>
                <div className="max-h-[34rem] space-y-2 overflow-hidden [mask-image:linear-gradient(to_bottom,black_88%,transparent)]">
                  <AnimatePresence initial={false} mode="popLayout">
                    {tickets.map((tk) => (
                      <TicketCard key={tk.id} ticket={tk} onOpen={setOpen} />
                    ))}
                  </AnimatePresence>
                  {tickets.length === 0 && (
                    <p className="rounded-xl border border-dashed border-line py-8 text-center text-xs text-muted">{t.emptyColumn}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </LayoutGroup>
      <TicketModal ticket={open} onClose={() => setOpen(null)} />
    </section>
  );
}

export function Approvals() {
  const t = useMessages();
  const [lang] = useLang();
  const floorName = useFloorName();
  const ago = useSecondsAgo();
  const sim = useLive();
  const [open, setOpen] = useState<SimTicket | null>(null);
  const pending = sim.tickets.filter((tk) => tk.state === "aguarda-aprovacao").sort(byPriority);

  return (
    <section id="aprovacoes" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionTitle title={t.approvalsTitle} body={t.approvalsBody} />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <AnimatePresence initial={false} mode="popLayout">
          {pending.map((tk) => (
            <motion.button
              key={tk.id}
              type="button"
              layout
              onClick={() => setOpen(tk)}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="card focus-ring group relative overflow-hidden p-5 text-left transition-colors duration-300 hover:border-orange/60"
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
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="font-mono">{tk.id}</span>
                    <PriorityBadge priority={tk.priority} />
                    <span>{t.waiting(ago(tk.history.at(-1)!.time))}</span>
                  </div>
                  <p className="mt-1.5 font-medium leading-snug">{tk.title[lang]}</p>
                  {tk.approvalAction && (
                    <p className="mt-2 text-sm text-muted">
                      <span className="text-orange">{t.approvalAction}:</span> {tk.approvalAction[lang]}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-muted">{floorName(tk.floor)}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
        {pending.length === 0 && <p className="card p-8 text-center text-muted md:col-span-2">{t.approvalsEmpty}</p>}
      </div>
      <TicketModal ticket={open} onClose={() => setOpen(null)} />
    </section>
  );
}

type SiteStatus = { name: string; url: string; up: boolean; ms: number | null };

export function ActivityAndStatus() {
  const t = useMessages();
  const [lang] = useLang();
  const floorName = useFloorName();
  const ago = useSecondsAgo();
  const sim = useLive();
  const [sites, setSites] = useState<SiteStatus[] | null>(null);
  const titleOf = (id: string) => sim.tickets.find((tk) => tk.id === id)?.title[lang];

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
    <section
      id="atividade"
      className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px]"
    >
      <div>
        <SectionTitle title={t.activityTitle} body={t.activityBody} />
        <ol className="mt-8 space-y-3">
          {sim.recent.length === 0 && <p className="text-muted">{t.activityEmpty}</p>}
          <AnimatePresence initial={false} mode="popLayout">
            {sim.recent.map((e) => (
              <motion.li
                key={`${e.ticketId}-${e.time}`}
                layout
                className="card flex items-center gap-4 p-4"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: STATE_COLOR[e.state] }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{e.action[lang]}</span>
                  <span className="block truncate text-xs text-muted">{titleOf(e.ticketId) ?? e.ticketId}</span>
                </span>
                <span className="hidden shrink-0 rounded-full border border-line px-2.5 py-0.5 text-xs text-muted sm:inline">
                  {floorName(e.floor)}
                </span>
                <span className="w-16 shrink-0 text-right font-mono text-xs text-muted">{t.ago(ago(e.time))}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      </div>

      <div>
        <SectionTitle title={t.statusTitle} body="ividi.dev · portal.ividi.dev" />
        <div className="card mt-8 divide-y divide-line">
          {(
            sites ?? [
              { name: "ividi.dev", url: "https://ividi.dev", up: false, ms: null },
              { name: "portal.ividi.dev", url: "https://portal.ividi.dev", up: false, ms: null },
            ]
          ).map((s) => (
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
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${!sites ? "animate-blink bg-muted" : s.up ? "bg-ok" : "bg-bad"}`}
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
