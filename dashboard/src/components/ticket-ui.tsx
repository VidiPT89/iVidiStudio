"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import type { Ticket, TicketState } from "@/lib/building";
import { floorBySlug } from "@/lib/floors";
import { useLang, useMessages } from "@/lib/preferences";
import { CloseIcon, HandIcon } from "./icons";

const PRIORITY_STYLE: Record<Ticket["priority"], string> = {
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

export function PriorityBadge({ priority }: { priority: Ticket["priority"] }) {
  return (
    <span className={`rounded-md border px-1.5 py-0.5 font-mono text-[11px] font-semibold ${PRIORITY_STYLE[priority]}`}>
      {priority}
    </span>
  );
}

export function TicketCard({ ticket, onOpen }: { ticket: Ticket; onOpen: (t: Ticket) => void }) {
  const floorName = useFloorName();
  return (
    <motion.button
      type="button"
      layout
      onClick={() => onOpen(ticket)}
      className="card focus-ring group block w-full p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-orange/50 hover:shadow-[0_12px_40px_-12px_var(--glow)]"
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-muted">{ticket.id}</span>
        <PriorityBadge priority={ticket.priority} />
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-medium leading-snug transition-colors group-hover:text-orange">
        {ticket.title}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted">
        <span className="truncate">{ticket.floor ? floorName(ticket.floor) : "—"}</span>
        {ticket.needsApproval && ticket.state === "aguarda-aprovacao" && (
          <HandIcon width={14} height={14} className="shrink-0 text-orange" />
        )}
      </div>
    </motion.button>
  );
}

export function TicketModal({ ticket, onClose }: { ticket: Ticket | null; onClose: () => void }) {
  const t = useMessages();
  const floorName = useFloorName();
  const stateLabel = useStateLabels();

  useEffect(() => {
    if (!ticket) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ticket, onClose]);

  return (
    <AnimatePresence>
      {ticket && (
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
                  <span className="font-mono text-xs text-muted">{ticket.id}</span>
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <h3 id="ticket-title" className="mt-2 text-xl font-semibold leading-snug">
                  {ticket.title}
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
                <span className="h-2 w-2 rounded-full" style={{ background: STATE_COLOR[ticket.state] }} />
                {stateLabel[ticket.state]}
              </span>
              {ticket.floor && (
                <span className="rounded-full border border-line px-2.5 py-1">{floorName(ticket.floor)}</span>
              )}
              {ticket.product && <span className="rounded-full border border-line px-2.5 py-1">{ticket.product}</span>}
              {ticket.clientRef && (
                <span className="rounded-full border border-line px-2.5 py-1 font-mono">{ticket.clientRef}</span>
              )}
            </div>

            {ticket.request && <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-fg/85">{ticket.request}</p>}

            {ticket.approvalAction && (
              <div className="mt-5 rounded-xl border border-orange/40 bg-orange/10 p-3 text-sm">
                <span className="font-semibold text-orange">{t.approvalAction}: </span>
                {ticket.approvalAction}
              </div>
            )}

            {ticket.history.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted">{t.history}</h4>
                <ol className="mt-3 space-y-3 border-l border-line pl-4">
                  {ticket.history.map((h, i) => (
                    <motion.li
                      key={i}
                      className="relative text-sm"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      <span className="bg-brand absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-surface" />
                      <p className="text-xs text-muted">
                        {h.data} · {floorName(h.piso)}
                      </p>
                      <p>{h.acao}</p>
                    </motion.li>
                  ))}
                </ol>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
