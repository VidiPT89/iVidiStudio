"use client";

import { AnimatePresence, motion } from "motion/react";
import { memo, useEffect } from "react";
import { floorBySlug } from "@/lib/floors";
import { useLang, useMessages } from "@/lib/preferences";
import type { Priority, SimTicket, TicketState } from "@/lib/simulation";
import { CloseIcon, HandIcon } from "./icons";
import { useLive } from "./live";

const PRIORITY_STYLE: Record<Priority, string> = {
  P0: "bg-bad/15 text-bad border-bad/30",
  P1: "bg-orange/15 text-orange border-orange/30",
  P2: "bg-gold/15 text-amber border-gold/30",
  P3: "bg-surface-2 text-muted border-line",
};

export const STATE_COLOR: Record<TicketState, string> = {
  entrada: "var(--muted)",
  "em-curso": "var(--gold)",
  "aguarda-aprovacao": "var(--orange)",
  concluido: "var(--ok)",
};

export function useStateLabels(): Record<TicketState, string> {
  const t = useMessages();
  return {
    entrada: t.stateEntrada,
    "em-curso": t.stateEmCurso,
    "aguarda-aprovacao": t.stateAguarda,
    concluido: t.stateConcluido,
  };
}

export function useFloorName() {
  const [lang] = useLang();
  return (slug: string) => floorBySlug(slug)?.name[lang] ?? slug;
}

/** Seconds between a moment of the simulation and now. */
export function useSecondsAgo() {
  const { now } = useLive();
  return (time: number) => Math.max(0, Math.round((now - time) / 1000));
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-semibold ${PRIORITY_STYLE[priority]}`}>
      {priority}
    </span>
  );
}

type TicketCardProps = { ticket: SimTicket; onOpen: (t: SimTicket) => void };

/** Re-renders only when its ticket moves, not on every tick of the simulation clock. */
export const TicketCard = memo(TicketCardView, (a: TicketCardProps, b: TicketCardProps) =>
  a.onOpen === b.onOpen && a.ticket.id === b.ticket.id && a.ticket.state === b.ticket.state && a.ticket.floor === b.ticket.floor,
);

function TicketCardView({ ticket, onOpen }: TicketCardProps) {
  const [lang] = useLang();
  const floorName = useFloorName();
  return (
    <motion.button
      type="button"
      layout
      layoutId={`card-${ticket.id}`}
      onClick={() => onOpen(ticket)}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 34 }}
      className="card focus-ring group block w-full p-4 text-left transition-colors duration-300 hover:border-orange/50 hover:shadow-[0_12px_40px_-12px_var(--glow)]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted">{ticket.id}</span>
        <PriorityBadge priority={ticket.priority} />
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-orange">
        {ticket.title[lang]}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted">
        <span className="truncate">{floorName(ticket.floor)}</span>
        {ticket.state === "aguarda-aprovacao" && <HandIcon width={14} height={14} className="shrink-0 text-orange" />}
      </div>
    </motion.button>
  );
}

export function TicketModal({ ticket, onClose }: { ticket: SimTicket | null; onClose: () => void }) {
  const t = useMessages();
  const [lang] = useLang();
  const floorName = useFloorName();
  const stateLabel = useStateLabels();
  const ago = useSecondsAgo();
  const sim = useLive();
  // Follow the ticket live while the window is open; keep the last view if it leaves the building.
  const current = (ticket && sim.tickets.find((x) => x.id === ticket.id)) ?? ticket;

  useEffect(() => {
    if (!ticket) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ticket, onClose]);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-title"
            className="card max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-b-none p-6 sm:rounded-b-[1.25rem]"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted">{current.id}</span>
                  <PriorityBadge priority={current.priority} />
                </div>
                <h3 id="ticket-title" className="mt-2 text-xl font-semibold leading-snug">
                  {current.title[lang]}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="focus-ring rounded-full border border-line p-1.5 text-muted transition-colors hover:border-orange hover:text-orange"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1">
                <span className="h-2 w-2 rounded-full" style={{ background: STATE_COLOR[current.state] }} />
                {stateLabel[current.state]}
              </span>
              <span className="rounded-full border border-line px-2.5 py-1">{floorName(current.floor)}</span>
            </div>

            {current.approvalAction && (
              <div className="mt-5 rounded-xl border border-orange/40 bg-orange/10 p-3 text-sm">
                <span className="font-semibold text-orange">{t.approvalAction}: </span>
                {current.approvalAction[lang]}
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted">{t.history}</h4>
              <ol className="mt-3 space-y-3 border-l border-line pl-4">
                {current.history.map((h) => (
                  <motion.li
                    key={h.time}
                    layout
                    className="relative text-sm"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <span className="bg-brand absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-surface" />
                    <p className="text-xs text-muted">
                      {t.ago(ago(h.time))} · {floorName(h.floor)}
                    </p>
                    <p>{h.action[lang]}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
